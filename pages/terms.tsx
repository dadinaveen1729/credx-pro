
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Page() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-24">
        <h1 className="text-4xl font-bold">Terms & Conditions</h1>
      </div>
      <Footer />
    </>
  );
}
