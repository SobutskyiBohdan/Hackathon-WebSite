import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  favoriteIds: [],
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.favoriteIds.includes(action.payload)) {
        state.favoriteIds.push(action.payload)
      }
    },
    removeFromFavorites: (state, action) => {
      state.favoriteIds = state.favoriteIds.filter((id) => id !== action.payload)
    },
    setFavorites: (state, action) => {
      state.favoriteIds = action.payload
    },
  },
})

export const { addToFavorites, removeFromFavorites, setFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
