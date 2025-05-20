import axios from "axios";

class DebugService {
  async testAPIConnection(url: string): Promise<boolean> {
    try {
      console.log(`Testing connection to: ${url}`);
      const response = await axios.get(url, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status code
      });

      console.log(`Connection test result: ${response.status}`, response.data);
      return response.status >= 200 && response.status < 400;
    } catch (error: any) {
      console.error("Connection test failed:", {
        message: error.message,
        code: error.code,
        isNetworkError: error.isAxiosError && !error.response,
      });
      return false;
    }
  }
}

export default new DebugService();
