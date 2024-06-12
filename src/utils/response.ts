import { Response } from 'express';

export const sendResponse = (
  res: Response,
  data: any,
  code: number = 200,
): void => {
  const {
    status: responseStatus,
    message: responseMessage,
    data: responseData,
    pagination: responsePagination,
  } = data;

  if (responseStatus === false && code === 200) {
    code = 400;
  }

  res.status(code).send({
    responseStatus,
    responseMessage,
    responseCode: code,
    responsePagination,
    responseData,
    timestamp: new Date().toJSON(),
  });
};
