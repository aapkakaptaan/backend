import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"


const createPlaylist = asyncHandler(async (req, res) => {
    // get playlist detail
    const { name, description, videos = [] } = req.body

    //TODO: create playlist
    //validation-not empty
    if (
        [name, description].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "Playlist name and description are required")
    }
    //validate each video id if videos are provided
    for (const videoId of videos) {
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "Invalid video id: ${videoId")
        }
    }
    //create 
    const playlist = await Playlist.create({
        name,
        description,
        videos,
        owner: req.user._id

    })
    //return
    return req.status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //get user
    const { userId } = req.params
    //TODO: get user playlists

    //validate user id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
    //get user playlists
    const playlists = await Playlist.find({ owner: userId }).populate({ path: "videos" })
    //return response
    return res.status(200)
        .json(new ApiResponse(200, playlists, "users playlist fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }
    //get playlist by id
    const playlist = await Playlist.findById(playlistId).populate({ path: "videos" })
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    //TODO: add video to playlist
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video id")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    const video = await Playlist.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const add = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: { videos: videoId },
        },
        {
            new: true,
        }
    ).select()
    return res.status(200)
        .json(new ApiResponse(200, add, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(404, "Invalid playlist or video id")
    }
    // validate if playlist exists or not
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    //validate if video exists or not
    const video = await Playlist.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    //remove video from playlist

    const remove = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    ).populate("videos")
    //return 
    return res.status(200)
        .json(new ApiResponse(200, remove, "Video removed from playlist successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError("Invalid playlist ID")
    }
    // validate if playlist exists or not
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    //delete playlist
    const deletePlay = await Playlist.findByIdAndDelete(playlistId)
    //return
    return res.status(200)
        .json(new ApiResponse(200, deletePlay, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    //validate atleast one of those are field
    if (!name || !description) {
        throw new ApiError(400, "Atleast one of name or description is required")
    }
    //validate that name is given
    if (name !== undefined && (!name || name.trim().length === 0)) {  // makes sure that the name length is not 0
        throw new ApiError(400, "Playlist name cannot be empty");
    }
    // validate if playlist exists or not
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                updateData
            }
        },
        { new: true }
    )
    //return
    return res.status(200)
        .json(new ApiResponse(200, updatePlaylist, "playlistUpdated Successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}