import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../api';
import { RootState } from '../store';

export const noAuthHeader = {
  'Content-Type': 'application/json' 
}

export const authApi = createApi({
  reducerPath: 'restApi', 
  baseQuery: fetchBaseQuery({ baseUrl:`${baseUrl}`,   
  prepareHeaders: (headers, {getState}) => {
    const state = getState() as RootState;
    const  token = state['auth'].accessToken;
  
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
  ,}),
  tagTypes: ['restapi'],
  endpoints: (build) => ({

    getResource: build.mutation({  
      query: ({endpoint}) => 
      ({
        url: `${endpoint}`,
        method: 'GET',
      })
    }),
    postResource: build.mutation({  query: ({data,endpoint}) => 
        ({
          url: `${endpoint}`,
          method: 'POST',
          body:data
        })
      }),
    
    postNoAuth: build.mutation({  query: ({data,endpoint}) => 
      ({
        url: `${endpoint}`,
        method: 'POST',
        body:data,
        headers:noAuthHeader
      })
    }),

    postFormData: build.mutation({  query: ({data,endpoint}) => 
        ({
          url: `${endpoint}`,
          method: 'POST',
          body:data,
          prepareHeaders:(headers:any)=>{
            headers.set('Content-Type','multipart/form-data')
            return headers
        },
        })
      }),
    
    patchResource: build.mutation({  query: ({data,endpoint}) => 
        ({
          url: `${endpoint}`,
          method: 'PATCH',
          body:data
        })
      }),

      patchFormData: build.mutation({  query: ({data,endpoint}) => 
        ({
          url: `${endpoint}`,
          method: 'PATCH',
          body:data,
          prepareHeaders:(headers:any)=>{
            headers.set('Content-Type','multipart/form-data')
            return headers
        },
        })
      }),
  
    deleteResource: build.mutation({  query: ({endpoint}) => (
        {
          url: `${endpoint}`,
          method: 'DELETE'
        })
      }),
     
})

})
export const { useGetResourceMutation,
  usePostResourceMutation, usePostFormDataMutation, usePostNoAuthMutation,usePatchFormDataMutation,
  usePatchResourceMutation, useDeleteResourceMutation} = authApi;










