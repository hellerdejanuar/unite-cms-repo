
module.exports = ({
  connect_disconnect_params (relation_connect, connect, relation_disconnect, disconnect) {
// # Parameter generation for strapi database handling

    if (typeof connect === 'string') {
      connect = parseInt(connect);
    }
    if (typeof disconnect === 'string') {
      disconnect = parseInt(disconnect);
    }
    const data = {};
  
    data[relation_connect] = { connect: [connect] };
    if (relation_disconnect) {
      data[relation_disconnect] = { disconnect: [disconnect] };
    }
  
    const obj = { data };
  
    return obj;
  }
})