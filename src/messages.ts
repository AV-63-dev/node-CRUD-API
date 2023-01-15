export const messageServerStart = () => console.log(`Server is running on port ${process.env.PORT}`);

export const messageBalancerStart = () => console.log(`Balancer is running on port ${process.env.PORT}`);

export const messagePortProcessingServer = () => console.log(`Processing Server on port ${process.env.PORT}`);

export const messageServerError = () => {
    console.log(`Server error (code 500)`);
    return {code: 500, body: 'Server error'};
};

export const messageNonExistEndpoint = () => { return {code: 404, body: 'Non exist endpoint'} };

export const messageNotUUID = () => { return {code: 400, body: 'Requested ID is not UUID'} };

export const messageNoData = () => { return {code: 404, body: 'Is no such data'} };

export const messageNoValidBody = () => { return {code: 400, body: 'No required fields in request body'} };