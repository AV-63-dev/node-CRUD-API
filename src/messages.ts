export const messageServerStart = () => console.log(`Server is running on port ${process.env.PORT}`);

export const messageBalancerStart = () => console.log(`Balancer is running on port ${process.env.PORT}`);

export const messagePortProcessingServer = () => console.log(`Processing Server on port ${process.env.PORT}`);

export const message = {
    serverError: 'Server error',
    nonExistEndpoint: 'Non exist endpoint',
    notUUID: 'Requested ID is not UUID',
    noData: 'Is no such data',
    noValidBody: 'No required fields in request body',
};

export const messageServerError = () => {
    console.log(`Server error (code 500)`);
    return {code: 500, body: message.serverError};
};

export const messageNonExistEndpoint = () => { return {code: 404, body: message.nonExistEndpoint} };

export const messageNotUUID = () => { return {code: 400, body: message.notUUID} };

export const messageNoData = () => { return {code: 404, body: message.noData} };

export const messageNoValidBody = () => { return {code: 400, body: message.noValidBody} };