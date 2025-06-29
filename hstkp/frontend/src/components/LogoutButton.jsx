import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Çıkış yapmak istiyor musunuz?',
      text: 'Oturumunuz sonlandırılacak.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, çıkış yap',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // LocalStorage temizle
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // Toast bildirimi
        toast.success('Başarıyla çıkış yapıldı 👋', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });

        // Giriş ekranına yönlendir
        navigate('/login');
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '6px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '20px'
      }}
    >
      Çıkış Yap
    </button>
  );
}
