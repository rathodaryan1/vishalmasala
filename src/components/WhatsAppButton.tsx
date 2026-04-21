import { MessageCircle } from "lucide-react";

/**
 * Floating WhatsApp contact button
 * Phone: +91 9375425771
 */
const WhatsAppButton = () => {
  const phoneNumber = "919375425771";
  const message = encodeURIComponent("Hello Vishal Masala! I would like to inquire about your spices and place an order.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-8 right-8 z-[90] flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-2 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 group-hover:fill-white transition-colors" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
        Order on WhatsApp
      </span>

      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping -z-10" />
    </a>
  );
};

export default WhatsAppButton;
