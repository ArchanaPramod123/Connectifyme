import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./NavBar";  
import { useParams } from "react-router-dom";

const AdminUserProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
     const baseURL = import.meta.env.VITE_BASE_URL;
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("access");
            try {
                const response = await axios.get(
                    `${baseURL}/post/profile/${userId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setProfile(response.data.profile);
                setPosts(response.data.posts);
            } catch (error) {
                setError("Failed to fetch profile data");
            }
        };

        fetchProfile();
    }, [userId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex bg-[#faf7f4] min-h-screen">
            <div className="w-1/6 bg-[#faf7f4] fixed border-r-2 min-h-screen">
                <Navbar />
            </div>
            <div className="w-full flex flex-col pl-[16.5%] pt-8 pb-8">
                <div className="flex flex-col items-center lg:flex-row lg:items-start lg:px-20 lg:py-8 lg:gap-8">
                    <div className="flex justify-center items-center relative mb-4 lg:mb-0 lg:w-1/3">
                        <img
                            className="w-40 h-40 lg:w-48 lg:h-48 object-cover rounded-full cursor-pointer"
                            src={`${profile.profile_picture}`}
                            alt="Profile"
                        />
                    </div>
                    <div className="flex flex-col items-center lg:items-start lg:col-span-2 lg:w-2/3">
                        <div className="text-2xl font-semibold mb-4">{profile.username}</div>
                        <div className="flex gap-8 mb-4">
                            <div className="text-center">
                                <div className="font-bold">{profile.total_posts}</div>
                                <div>Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">{profile.follower_count}</div>
                                <div>Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">{profile.following_count}</div>
                                <div>Following</div>
                            </div>
                        </div>
                        <div className="text-center lg:text-left">
                            <div className="font-semibold">{profile.full_name}</div>
                            <div>{profile.bio || "No bio available"}</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 px-20 py-8">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="w-full aspect-square bg-gray-300 rounded-md overflow-hidden"
                        >
                            <img
                                className="w-full h-full object-cover"
                                src={`${post.img}`}
                                alt={post.body}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminUserProfilePage;
