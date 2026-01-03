// import { QrCode, ArrowRight } from 'lucide-react';
// // import { Button } from '@/components/ui/button';

// const Hero = () => {
//   return (
//     <section className="section-padding py-20 lg:py-32">
//       <div className="container-narrow">
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//           {/* Left: Copy */}
//           <div className="fade-in-up">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight text-balance">
//               Scan. Select. Send.
//             </h1>
//             <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
//               QR-based file sharing for shops and service counters. 
//               No apps, no accounts, no friction.
//             </p>
//             <div className="mt-8 flex flex-col sm:flex-row gap-4">
//               {/* <Button size="lg" className="group">
//                 Get Started Free
//                 <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//               </Button>
//               <Button variant="outline" size="lg">
//                 See How It Works
//               </Button> */}
//             </div>
//             <p className="mt-6 text-sm text-muted-foreground">
//               Free for up to 100 transfers/month. No credit card required.
//             </p>
//           </div>

//           {/* Right: Visual */}
//           <div className="fade-in-up animation-delay-200 flex justify-center lg:justify-end">
//             <div className="relative">
//               {/* Phone mockup */}
//               <div className="w-64 sm:w-72 h-[500px] sm:h-[540px] bg-card rounded-[2.5rem] shadow-card-hover border border-border p-3 relative overflow-hidden">
//                 <div className="w-full h-full bg-background rounded-[2rem] flex flex-col items-center justify-center p-6">
//                   {/* QR placeholder */}
//                   <div className="w-40 h-40 sm:w-48 sm:h-48 bg-foreground rounded-2xl flex items-center justify-center mb-6">
//                     <QrCode className="w-32 h-32 sm:w-40 sm:h-40 text-background" />
//                   </div>
//                   <p className="text-sm font-medium text-foreground text-center">
//                     Scan to upload files
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1 text-center">
//                     PrintShop Express
//                   </p>
                  
//                   {/* Upload indicator */}
//                   <div className="mt-8 w-full bg-secondary rounded-lg p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                         <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-foreground truncate">document.pdf</p>
//                         <p className="text-xs text-muted-foreground">Uploading...</p>
//                       </div>
//                     </div>
//                     <div className="mt-3 h-1.5 bg-border rounded-full overflow-hidden">
//                       <div className="h-full w-2/3 bg-primary rounded-full transition-all duration-500" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Floating badge */}
//               <div className="absolute -right-4 top-20 bg-card rounded-xl shadow-card-hover border border-border p-3 fade-in-up animation-delay-300">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                     <div className="w-2 h-2 bg-green-500 rounded-full" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium text-foreground">File received</p>
//                     <p className="text-[10px] text-muted-foreground">Just now</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;