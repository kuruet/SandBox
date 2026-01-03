// import { XCircle, CheckCircle, MessageSquare, Mail, HelpCircle, ShieldOff, QrCode, Eye, Activity, Lock } from 'lucide-react';

// const problems = [
//   { icon: MessageSquare, text: 'WhatsApp chaos & lost files' },
//   { icon: Mail, text: 'Email attachments everywhere' },
//   { icon: HelpCircle, text: 'No confirmation or tracking' },
//   { icon: ShieldOff, text: 'Privacy & security concerns' },
// ];

// const solutions = [
//   { icon: QrCode, text: 'One QR code per counter' },
//   { icon: Eye, text: 'Vendor-only file access' },
//   { icon: Activity, text: 'Real-time status updates' },
//   { icon: Lock, text: 'Secure, isolated transfers' },
// ];

// const ProblemSolution = () => {
//   return (
//     <section className="section-padding py-20 lg:py-28 bg-card">
//       <div className="container-narrow">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
//             File sharing shouldn't be this hard
//           </h2>
//           <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
//             Traditional methods create confusion, delays, and security risks. There's a better way.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
//           {/* Problems */}
//           <div className="bg-background rounded-2xl p-8 border border-border">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//                 <XCircle className="w-5 h-5 text-red-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-foreground">The Problem</h3>
//             </div>
//             <ul className="space-y-4">
//               {problems.map((item, index) => (
//                 <li 
//                   key={index} 
//                   className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
//                 >
//                   <item.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
//                   <span className="text-foreground">{item.text}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Solutions */}
//           <div className="bg-background rounded-2xl p-8 border border-primary/20">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 text-primary" />
//               </div>
//               <h3 className="text-xl font-semibold text-foreground">The Solution</h3>
//             </div>
//             <ul className="space-y-4">
//               {solutions.map((item, index) => (
//                 <li 
//                   key={index} 
//                   className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors"
//                 >
//                   <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
//                   <span className="text-foreground">{item.text}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProblemSolution;