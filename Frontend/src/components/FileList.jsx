// import React from "react";

// const FileList = ({
//   files = [],
//   onOpen,
//   onMarkPrinted,
//   selectedFiles = [],
//   onToggleSelect,
//   onSelectAll,
// }) => {
//   return (
//     <table className="w-full border border-gray-300">
//       <thead>
//         <tr className="bg-gray-200">
//           <th className="p-2 border">
//             <input
//               type="checkbox"
//               onChange={(e) => onSelectAll(e.target.checked)}
//             />
//           </th>
//           <th className="p-2 border">Sender</th>
//           <th className="p-2 border">File</th>
//           <th className="p-2 border">Type</th>
//           <th className="p-2 border">Uploaded</th>
//           <th className="p-2 border">Printed</th>
//           <th className="p-2 border">Actions</th>
//         </tr>
//       </thead>

//       <tbody>
//         {files.map((file) => (
//           <tr
//             key={file._id}
//             className="text-center cursor-pointer hover:bg-gray-100"
//             onDoubleClick={() => onOpen(file)}
//           >
//             <td className="p-2 border">
//               <input
//                 type="checkbox"
//                 checked={selectedFiles.includes(file._id)}
//                 onChange={() => onToggleSelect(file._id)}
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </td>

//             <td className="p-2 border">{file.senderName}</td>
//             <td className="p-2 border">{file.originalName}</td>
//             <td className="p-2 border">{file.fileType}</td>
//             <td className="p-2 border">
//               {new Date(file.createdAt).toLocaleString()}
//             </td>
//             <td className="p-2 border">
//               {file.printed ? "Yes" : "No"}
//             </td>
//             <td className="p-2 border">
//               {file.printed ? (
//                 <span className="text-green-600 font-semibold">
//                   Printed ✓
//                 </span>
//               ) : (
//                 <button
//                   className="bg-blue-500 text-white px-2 py-1 rounded"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onMarkPrinted(file._id);
//                   }}
//                 >
//                   Mark as Printed
//                 </button>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default FileList;
