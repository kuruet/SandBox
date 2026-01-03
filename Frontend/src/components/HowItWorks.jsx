// import { Smartphone, Upload, CheckCircle } from 'lucide-react';

// const steps = [
//   {
//     number: '01',
//     icon: Smartphone,
//     title: 'Scan QR Code',
//     description: 'Customer scans the QR at your counter using any phone camera.',
//   },
//   {
//     number: '02',
//     icon: Upload,
//     title: 'Upload Files',
//     description: 'Select and send files directly from the browser. No app needed.',
//   },
//   {
//     number: '03',
//     icon: CheckCircle,
//     title: 'Process & Confirm',
//     description: 'Vendor receives files instantly, processes, and updates status.',
//   },
// ];

// const HowItWorks = () => {
//   return (
//     <section className="section-padding py-20 lg:py-28">
//       <div className="container-narrow">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
//             How it works
//           </h2>
//           <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
//             Three simple steps. Zero learning curve.
//           </p>
//         </div>

//         {/* Desktop: Horizontal stepper */}
//         <div className="hidden md:block">
//           <div className="relative">
//             {/* Connection line */}
//             <div className="absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-border" />
            
//             <div className="grid md:grid-cols-3 gap-8">
//               {steps.map((step, index) => (
//                 <div 
//                   key={index} 
//                   className="relative text-center fade-in-up"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   {/* Icon circle */}
//                   <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
//                     <div className="absolute inset-0 bg-primary/5 rounded-full" />
//                     <div className="relative w-20 h-20 bg-card rounded-full border-2 border-primary/20 flex items-center justify-center shadow-soft">
//                       <step.icon className="w-8 h-8 text-primary" />
//                     </div>
//                     <span className="absolute -top-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
//                       {index + 1}
//                     </span>
//                   </div>
                  
//                   <h3 className="text-xl font-semibold text-foreground mb-2">
//                     {step.title}
//                   </h3>
//                   <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
//                     {step.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Mobile: Vertical stack */}
//         <div className="md:hidden space-y-8">
//           {steps.map((step, index) => (
//             <div 
//               key={index} 
//               className="flex gap-4 fade-in-up"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <div className="flex flex-col items-center">
//                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
//                   <step.icon className="w-5 h-5 text-primary" />
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div className="w-0.5 h-full bg-border mt-2" />
//                 )}
//               </div>
//               <div className="pb-8">
//                 <span className="text-xs font-medium text-primary mb-1 block">
//                   Step {index + 1}
//                 </span>
//                 <h3 className="text-lg font-semibold text-foreground mb-1">
//                   {step.title}
//                 </h3>
//                 <p className="text-muted-foreground text-sm leading-relaxed">
//                   {step.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HowItWorks;