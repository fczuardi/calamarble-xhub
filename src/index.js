import crypto from 'crypto';


const signSha1 = (secret, msg) =>
    crypto.createHmac('sha1', secret).update(msg).digest('hex');

const apiEndpoint = config => (req, res) => {
    const serverSignature = signSha1(config.xHubSecret, JSON.stringify(req.body));
    const result = {
        ...req.headers,
        'my-debug-header': serverSignature
    };
    console.log('---HI---', serverSignature, req.headers);
    return res ? res.send(result) : result;
};

export {
    apiEndpoint
};
