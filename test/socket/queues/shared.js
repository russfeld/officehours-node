exports.shouldConnectToQueueSocket = function () {
  it('should connect to queue socket', function (done) {
    this.admin_socket.emit('queue:connect', (response, requests) => {
      response.should.equal(200)
      requests.should.be.a('array')
      done()
    })
  })
}
