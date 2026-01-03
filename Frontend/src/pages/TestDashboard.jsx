import React, { useState, useEffect } from 'react';
import { LogOut, List, Grid, FileText, User, Clock, CheckCircle2, XCircle } from 'lucide-react';

const VendorDashboard = () => {
  // State management
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('vendorViewMode') || 'list';
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mock data - in production this would come from props/API
  const shopName = "PrintHub Central";
  const vendorName = "John Anderson";
  const isBlocked = false;
  const qrCodeBase64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iNDAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSI2MCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iNjAiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjQwIiB5PSI2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iNjAiIHk9IjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=";
  
  const [files, setFiles] = useState([
    { id: 1, name: 'invoice_2024.pdf', sender: 'Sarah Mitchell', printed: false, uploadedAt: '2024-12-27 14:30' },
    { id: 2, name: 'contract_signed.pdf', sender: 'Michael Chen', printed: true, uploadedAt: '2024-12-27 13:15' },
    { id: 3, name: 'presentation.pptx', sender: 'Emily Rodriguez', printed: false, uploadedAt: '2024-12-27 12:00' },
    { id: 4, name: 'report_Q4.docx', sender: 'David Thompson', printed: true, uploadedAt: '2024-12-27 10:45' },
    { id: 5, name: 'budget_2025.xlsx', sender: 'Lisa Anderson', printed: false, uploadedAt: '2024-12-27 09:20' },
  ]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const paginatedFiles = files.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('vendorViewMode', viewMode);
  }, [viewMode]);

  const handleMarkAsPrinted = (fileId) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, printed: true } : file
    ));
    showToastNotification('File marked as printed');
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = () => {
    // In production: call API to invalidate token
    console.log('Logging out...');
    window.location.href = '/login';
  };

  const newFilesCount = files.filter(f => !f.printed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-2 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">{toastMessage}</span>
        </div>
      )}

      {/* Blocked Vendor Banner */}
      {isBlocked && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <XCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-900 font-medium">
              Your account is currently blocked. Please contact admin.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Vendor Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Shop: {shopName} • Vendor: {vendorName}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  disabled={isBlocked}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  disabled={isBlocked}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* QR Code Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <img 
                src={qrCodeBase64} 
                alt="Shop QR Code" 
                className="w-40 h-40 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Upload QR Code</h2>
              <p className="text-gray-600 mt-1 mb-3">
                Customers scan this to upload files
              </p>
              <p className="text-sm text-gray-500 bg-gray-50 rounded px-3 py-2 inline-block">
                This QR is unique to your shop
              </p>
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Files</h2>
                <p className="text-sm text-gray-500 mt-0.5">Newest files appear first</p>
              </div>
              {newFilesCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {newFilesCount} new {newFilesCount === 1 ? 'file' : 'files'}
                </span>
              )}
            </div>
          </div>

          {/* Empty State */}
          {files.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No files yet</h3>
              <p className="text-gray-500">Files uploaded by customers will appear here</p>
            </div>
          ) : (
            <>
              {/* List View */}
              {viewMode === 'list' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sender Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Printed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedFiles.map((file) => (
                        <tr 
                          key={file.id} 
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {file.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{file.sender}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {file.printed ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Printed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                <Clock className="w-3.5 h-3.5" />
                                Not Printed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleMarkAsPrinted(file.id)}
                              disabled={file.printed || isBlocked}
                              className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${
                                file.printed || isBlocked
                                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                  : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                              }`}
                            >
                              Mark as Printed
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedFiles.map((file) => (
                    <div 
                      key={file.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-10 h-10 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {file.sender}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-auto space-y-2">
                          {file.printed ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3" />
                              Printed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              <Clock className="w-3 h-3" />
                              Not Printed
                            </span>
                          )}
                          
                          <button
                            onClick={() => handleMarkAsPrinted(file.id)}
                            disabled={file.printed || isBlocked}
                            className={`w-full text-sm font-medium px-3 py-2 rounded transition-colors ${
                              file.printed || isBlocked
                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                            }`}
                          >
                            Mark as Printed
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isBlocked}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isBlocked}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;