import local from './config.local';
// dev 和 local 都跑在本机，直接复用，避免数据库凭据两处维护
export default local;
