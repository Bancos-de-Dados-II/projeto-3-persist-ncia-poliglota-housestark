import { Header } from '../components/header';
import { useNavigate } from 'react-router';
import { Footer } from '../components/footer';
import { useState } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contatos'), formData);
      alert('Mensagem enviada!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
      alert('Erro no envio!');
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <Header navigate={navigate} />
      <div className='bg-slate-300 p-8 pt-0'>
        <section className='bg-slate-50 p-8 rounded-xl'>
          <div className='flex justify-between'>
            <div className='flex-col self-center max-w-lg'>
              <h1 className='text-5xl font-bold mb-3'>GreenTech</h1>
              <h4 className='text-xl font-semibold mb-3'>Junte-se à maior rede de agricultores do mercado</h4>
              <p className='mb-4'>Cadastre sua propriedade e conecte-se com outros agricultores pelo Brasil.</p>
              <button 
                className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition'
                onClick={() => navigate('/cadastro')}
              >
                Cadastre sua propriedade
              </button>
            </div>
            <div>
              <img className='rounded-xl w-96' src='https://media.istockphoto.com/id/649730316/pt/foto/tranquil-view-of-corn-farm-during-sunset.jpg?s=612x612&w=0&k=20&c=4nbXd-xJWnzsLHcHsX-FD_cHcBL6FydcGXJhjOOjukw=' alt='Fazenda ao pôr do sol' />
            </div>
          </div>
        </section>
        
        <section className='mt-10 p-8 bg-green-100 rounded-xl shadow-lg'>
          <h2 className='text-3xl font-semibold mb-6 text-center'>Entre em Contato</h2>
          <form className='max-w-lg mx-auto' onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-gray-700 font-semibold'>Nome</label>
              <input type='text' name='name' className='w-full p-2 border rounded-lg' placeholder='Seu nome' value={formData.name} onChange={handleChange} required />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-semibold'>Email</label>
              <input type='email' name='email' className='w-full p-2 border rounded-lg' placeholder='Seu email' value={formData.email} onChange={handleChange} required />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-semibold'>Mensagem</label>
              <textarea name='message' className='w-full p-2 border rounded-lg' rows='4' placeholder='Sua mensagem' value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <button className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
}