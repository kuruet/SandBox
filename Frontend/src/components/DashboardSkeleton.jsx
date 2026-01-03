import React from "react";

const VendorDashboardSkeleton = () => {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "linear-gradient(135deg, #05060A 0%, #0B1020 50%, #0E1A2F 100%)",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.4;
          }
        }

        .skeleton-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>

      <header
        className="w-full px-8 py-4 flex items-center justify-between"
        style={{
          borderBottom: "1px solid rgba(59, 130, 246, 0.25)",
          background: "rgba(11, 16, 32, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex flex-col gap-2">
          <div
            className="h-7 w-48 rounded skeleton-shimmer"
            style={{ background: "rgba(59, 130, 246, 0.15)" }}
          />
          <div
            className="h-4 w-32 rounded skeleton-shimmer"
            style={{ background: "rgba(59, 130, 246, 0.1)" }}
          />
        </div>

        <div
          className="h-9 w-20 rounded-lg skeleton-shimmer"
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.25)",
          }}
        />
      </header>

      <main className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "#0B1020",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              className="h-6 w-32 rounded mb-6 skeleton-shimmer"
              style={{ background: "rgba(59, 130, 246, 0.15)" }}
            />

            <div
              className="w-full aspect-square rounded-xl mb-6 flex items-center justify-center skeleton-shimmer"
              style={{
                background: "#0E122A",
                border: "2px dashed rgba(59, 130, 246, 0.3)",
              }}
            >
              <div
                className="w-32 h-32 rounded-lg"
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                }}
              />
            </div>

            <div
              className="w-full h-12 rounded-lg mb-4 skeleton-shimmer"
              style={{
                background: "rgba(59, 130, 246, 0.2)",
              }}
            />

            <div className="flex flex-col gap-2 items-center">
              <div
                className="h-3 w-3/4 rounded skeleton-shimmer"
                style={{ background: "rgba(59, 130, 246, 0.1)" }}
              />
              <div
                className="h-3 w-2/3 rounded skeleton-shimmer"
                style={{ background: "rgba(59, 130, 246, 0.1)" }}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "#0B1020",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="h-6 w-16 rounded skeleton-shimmer"
                    style={{ background: "rgba(59, 130, 246, 0.15)" }}
                  />
                  <div
                    className="h-6 w-8 rounded-full skeleton-shimmer"
                    style={{ background: "rgba(59, 130, 246, 0.15)" }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-20 rounded-lg skeleton-shimmer"
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.25)",
                    }}
                  />

                  <div
                    className="flex items-center gap-2 p-1 rounded-lg"
                    style={{
                      background: "#0E122A",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    <div
                      className="h-8 w-16 rounded-md skeleton-shimmer"
                      style={{ background: "rgba(59, 130, 246, 0.2)" }}
                    />
                    <div
                      className="h-8 w-16 rounded-md skeleton-shimmer"
                      style={{ background: "rgba(59, 130, 246, 0.1)" }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="mb-4 p-3 rounded-lg flex items-center justify-between"
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                <div
                  className="h-4 w-32 rounded skeleton-shimmer"
                  style={{ background: "rgba(59, 130, 246, 0.2)" }}
                />
                <div className="flex items-center gap-2">
                  <div
                    className="h-7 w-28 rounded-lg skeleton-shimmer"
                    style={{ background: "rgba(59, 130, 246, 0.2)" }}
                  />
                  <div
                    className="h-7 w-20 rounded-lg skeleton-shimmer"
                    style={{ background: "rgba(239, 68, 68, 0.2)" }}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                    >
                      <th className="text-left py-3 px-4">
                        <div
                          className="h-4 w-4 rounded skeleton-shimmer"
                          style={{ background: "rgba(59, 130, 246, 0.2)" }}
                        />
                      </th>
                      <th className="text-left py-3 px-4">
                        <div
                          className="h-3 w-24 rounded skeleton-shimmer"
                          style={{ background: "rgba(59, 130, 246, 0.15)" }}
                        />
                      </th>
                      <th className="text-left py-3 px-4">
                        <div
                          className="h-3 w-20 rounded skeleton-shimmer"
                          style={{ background: "rgba(59, 130, 246, 0.15)" }}
                        />
                      </th>
                      <th className="text-left py-3 px-4">
                        <div
                          className="h-3 w-20 rounded skeleton-shimmer"
                          style={{ background: "rgba(59, 130, 246, 0.15)" }}
                        />
                      </th>
                      <th className="text-left py-3 px-4">
                        <div
                          className="h-3 w-16 rounded skeleton-shimmer"
                          style={{ background: "rgba(59, 130, 246, 0.15)" }}
                        />
                      </th>
                      <th className="text-left py-3 px-4">
                        <div
                          className="h-3 w-16 rounded skeleton-shimmer"
                          style={{ background: "rgba(59, 130, 246, 0.15)" }}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
                        }}
                      >
                        <td className="py-4 px-4">
                          <div
                            className="h-4 w-4 rounded skeleton-shimmer"
                            style={{ background: "rgba(59, 130, 246, 0.2)" }}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className="h-4 w-32 rounded skeleton-shimmer"
                            style={{ background: "rgba(59, 130, 246, 0.15)" }}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className="h-4 w-48 rounded skeleton-shimmer"
                            style={{ background: "rgba(59, 130, 246, 0.15)" }}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className="h-8 w-8 rounded-lg skeleton-shimmer"
                            style={{
                              background: "rgba(124, 58, 237, 0.15)",
                              border: "1px solid rgba(124, 58, 237, 0.25)",
                            }}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className="h-6 w-20 rounded-full skeleton-shimmer"
                            style={{ background: "rgba(251, 191, 36, 0.15)" }}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className="h-8 w-32 rounded-lg skeleton-shimmer"
                            style={{
                              background: "rgba(59, 130, 246, 0.1)",
                              border: "1px solid rgba(59, 130, 246, 0.25)",
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardSkeleton;