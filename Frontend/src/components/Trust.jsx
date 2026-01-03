// import { UserX, Timer, Users, Building } from 'lucide-react';

// const trustPoints = [
//   {
//     icon: UserX,
//     title: 'No login required',
//     description: 'Customers upload without creating accounts.',
//   },
//   {
//     icon: Timer,
//     title: 'Auto-expiring files',
//     description: 'Files are automatically deleted after processing.',
//   },
//   {
//     icon: Users,
//     title: 'Vendor isolation',
//     description: 'Each vendor only sees their own uploads.',
//   },
//   {
//     icon: Building,
//     title: 'Built for real environments',
//     description: 'Designed for busy counters, not tech demos.',
//   },
// ];

// const Trust = () => {
//   return (
//     <section className="section-padding py-20 lg:py-28 bg-card">
//       <div className="container-narrow">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
//             Privacy & trust built in
//           </h2>
//           <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
//             We take security seriously so you don't have to worry.
//           </p>
//         </div>

//         <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
//           {trustPoints.map((point, index) => (
//             <div
//               key={index}
//               className="flex gap-4 p-5 rounded-xl bg-background border border-border fade-in-up"
//               style={{ animationDelay: `${index * 50}ms` }}
//             >
//               <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <point.icon className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-foreground mb-1">
//                   {point.title}
//                 </h3>
//                 <p className="text-muted-foreground text-sm leading-relaxed">
//                   {point.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Trust;