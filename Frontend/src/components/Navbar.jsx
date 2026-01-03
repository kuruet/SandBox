// import { QrCode, Menu, X } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// import { useState } from 'react';

// const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <header className="section-padding py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
//       <div className="container-narrow">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <a href="/" className="flex items-center gap-2">
//             <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
//               <QrCode className="w-5 h-5 text-primary-foreground" />
//             </div>
//             <span className="font-semibold text-foreground text-lg">QRShare</span>
//           </a>

//           {/* Desktop nav */}
//           <nav className="hidden md:flex items-center gap-8">
//             <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//               Features
//             </a>
//             <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//               How It Works
//             </a>
//             <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//               Pricing
//             </a>
//           </nav>

//           {/* Desktop CTA */}
//           <div className="hidden md:flex items-center gap-3">
//             {/* <Button variant="ghost" size="sm" asChild>
//               <a href="/login">Login</a>
//             </Button>
//             <Button size="sm">Get Started</Button> */}
//           </div>

//           {/* Mobile menu button */}
//           <button
//             className="md:hidden p-2 text-foreground"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//           </button>
//         </div>

//         {/* Mobile menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
//             <nav className="flex flex-col gap-3">
//               <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
//                 Features
//               </a>
//               <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
//                 How It Works
//               </a>
//               <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
//                 Pricing
//               </a>
//               <div className="flex flex-col gap-2 mt-4">
//                 <Button variant="outline" size="sm" asChild>
//                   <a href="/login">Login</a>
//                 </Button>
//                 <Button size="sm">Get Started</Button>
//               </div>
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Navbar;