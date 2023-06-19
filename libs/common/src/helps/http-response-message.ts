import { HttpResponseMessageModel } from './http-response-message.model';

export class HttpResponseMessage {
  async Ok(
    data: any = null,
    message = 'Success',
  ): Promise<HttpResponseMessageModel> {
    return {
      statusCode: 200,
      message: message,
      data: data,
    } as HttpResponseMessageModel;
  }
  async BadRequest(
    data: any = null,
    message = 'Success',
  ): Promise<HttpResponseMessageModel> {
    return {
      statusCode: 200,
      message: message,
      data: data,
    } as HttpResponseMessageModel;
  }
}
