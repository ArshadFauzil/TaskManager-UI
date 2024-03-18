import axios from 'axios';

export default axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_ENDPOINT}`,
  headers: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
    }
  }
});