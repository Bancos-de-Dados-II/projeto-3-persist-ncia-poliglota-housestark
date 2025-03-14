import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import redisClient from "../../redis/redisClient";

const prisma = new PrismaClient();

export const createFarmer = async (req: Request, res: Response) => {
    try {
        const { nome, email, telefone, tamanhoTerreno, posicaoXTerreno, posicaoYTerreno } = req.body;
        if (nome && email && telefone && tamanhoTerreno && posicaoXTerreno && posicaoYTerreno) {
            const farmer = await prisma.agricultor.create({
                data: {
                    nome,
                    email,
                    telefone,
                    tamanhoTerreno,
                    localizacao: {
                        type: "Point",
                        coordinates: [
                            parseFloat(posicaoYTerreno),     // A ordem é invertida pois a geolocalização usa a ordem (longitude, latitude) ao invés de (latitude, longitude)
                            parseFloat(posicaoXTerreno),  
                        ]
                    },
                },
            })
            await redisClient.del("farmers");
            res.status(201).json({ "message": "Agricultor criado com sucesso!" });
            return;
        } else {
            res.status(400).json({ "message": "Todos os campos devem ser preenchidos!" });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}

export const getAllFarmers = async (req: Request, res: Response) => {
    try {
        const cachedFarmers = await redisClient.get("farmers");
        if (cachedFarmers) {
            res.status(200).json(JSON.parse(cachedFarmers));
            return;
        }
        const farmers = await prisma.agricultor.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                tamanhoTerreno: true,
                localizacao: true,
            },
        });

        if (farmers.length > 0) {
            await redisClient.set("farmers", JSON.stringify(farmers), { EX: 60 });
            res.status(200).json(farmers);
            return;
        }

        res.status(404).json({ "message": "Nenhum agricultor encontrado!" });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};

export const getFarmerById = async (req: Request, res: Response) => {
    try {
        const farmerId = req.params.id;

        // Verifica se o ID é um ObjectId válido antes da consulta
        if (!ObjectId.isValid(farmerId)) {
            res.status(400).json({ error: "ID inválido" });
            return;
        }

        // Verifica se o agricultor está no cache
        const cachedFarmer = await redisClient.get(`farmer:${farmerId}`);
        if (cachedFarmer) {
            res.status(200).json(JSON.parse(cachedFarmer));
            return;
        }

        const farmer = await prisma.agricultor.findUnique({
            where: {
                id: farmerId
            },
        });

        if (farmer) {
            // Armazena o agricultor no cache
            await redisClient.set(`farmer:${farmerId}`, JSON.stringify(farmer), { EX: 60 });
            res.status(200).json(farmer);
            return;
        }

        res.status(404).json({ message: "Nenhum agricultor encontrado!" });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
        return;
    }
};



export const updateFarmer = async (req: Request, res: Response) => {
    try {
        const { nome, email, telefone, tamanhoTerreno, posicaoXTerreno, posicaoYTerreno } = req.body;

        if (!nome || !email || !telefone || !tamanhoTerreno || !posicaoXTerreno || !posicaoYTerreno) {
            res.status(400).json({ message: "Todos os campos devem ser preenchidos!" });
            return;
        }

        const x = parseFloat(posicaoXTerreno);
        const y = parseFloat(posicaoYTerreno);
        const id = req.params.id;

        if (isNaN(x) || isNaN(y)) {
            res.status(400).json({ message: "As coordenadas devem ser números válidos!" });
            return;
        }
        
        const farmerEmail = await prisma.agricultor.findUnique({
            where: {
                email: email
            }
        });

        if (farmerEmail && farmerEmail.id !== id) {
            res.status(400).json({ message: "Email já cadastrado por outro usuário!" });
            return;
        }

        const farmer = await prisma.agricultor.update({
            where: {
                id: id
            },
            data: {
                nome,
                email,
                telefone,
                tamanhoTerreno,
                localizacao: {
                    type: "Point",
                    coordinates: [y, x]
                }
            }
        });

        if (farmer) {
            await redisClient.del(`farmer:${id}`);
            await redisClient.del("farmers");
            res.status(200).json({ message: "Agricultor atualizado com sucesso!" });
            return;
        }

        res.status(404).json({ message: "Agricultor não encontrado!" });
        return;
    } catch (error) {
        console.error("Erro ao atualizar agricultor:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};

export const deleteFarmer = async (req: Request, res: Response) => {
    try {
        const farmerId = req.params.id;

        // Verifica se o ID é um ObjectId válido antes da consulta
        if (!ObjectId.isValid(farmerId)) {
            res.status(400).json({ error: "ID inválido" });
            return;
        }

        const farmer = await prisma.agricultor.findUnique({
            where: {
                id: farmerId
            }
        });

        if (farmer) {
            await prisma.agricultor.delete({
                where: {
                    id: farmerId
                }
            });

            // Remove o agricultor do cache
            await redisClient.del(`farmer:${farmerId}`);
            await redisClient.del("farmers"); // Opcional, para garantir que a lista esteja atualizada

            res.status(200).json({ "message": "Agricultor excluído com sucesso!" });
            return;
        } 

        res.status(404).json({ "message": "Agricultor não encontrado!" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
