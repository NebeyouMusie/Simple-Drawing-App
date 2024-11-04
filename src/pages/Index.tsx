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
              src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
              alt="Simple drawing tools"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Simple Drawing Tools</h3>
            <p className="text-gray-600">Basic brush and eraser tools for quick, hassle-free sketching. No complex features to get in your way.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Easy to use interface"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">Start drawing right away with our straightforward interface. No learning curve, just pure creativity.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <img
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027"
              alt="Save your work"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Quick Save</h3>
            <p className="text-gray-600">Download your simple sketches instantly with just one click. No account needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;