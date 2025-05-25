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
  formMock( data: unknown) {
    console.log('Mocking data', data);
   // useMockService.getState().setSubmittedData(data)
    toast.success('Mocking data', {
      description: JSON.stringify(data),
    });
  }
}


export const mockService = new MockService();