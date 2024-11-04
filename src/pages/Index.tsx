import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 animate-fade-in font-poppins">
      <div className="container px-4 mx-auto">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple Drawing App
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your own sketches online with our intuitive drawing tools!
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/draw")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
          >
            Start Drawing
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <img
              src="https://images.unsplash.com/photo-1473091534298-04dcbce3278c"
              alt="Drawing tools"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Easy to Use Tools</h3>
            <p className="text-gray-600">Simple and intuitive drawing tools for quick sketches and designs.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
              alt="User drawing"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Free Drawing</h3>
            <p className="text-gray-600">Express your creativity with our free-form drawing tools.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <img
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
              alt="Download feature"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Save Your Work</h3>
            <p className="text-gray-600">Download your creations instantly to your device.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;