import {toast} from "sonner"


class MockService {
  constructor() {
    this.startMocking();
  }

  startMocking() {
    toast.success("Mocking enabled");
    console.log('Mock service started');
  }
  stopMocking() {
    toast.success("Mocking disabled");
    console.log('Mock service stopped');
  }
}


export const mockService = new MockService();