const vendorSocket = (io, socket) => {
  const vendorId = socket.vendorId;

  const roomName = `vendor:${vendorId}`;
  socket.join(roomName);

  console.log(`✅ Vendor connected: ${vendorId}`);

  socket.on("disconnect", (reason) => {
    console.log(`❌ Vendor disconnected: ${vendorId} | Reason: ${reason}`);
  });
};

export default vendorSocket;
