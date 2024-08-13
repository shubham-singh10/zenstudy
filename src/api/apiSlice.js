// src/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API }),
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => "zenstudy/api/course/getCoursesP",
    }),
  }),
});

export const { useGetCoursesQuery } = apiSlice;
