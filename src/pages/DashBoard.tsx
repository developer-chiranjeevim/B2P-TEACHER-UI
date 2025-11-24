import React,{ useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Users, DollarSign, Video, Clock, ChevronLeft, ChevronRight, Calendar, User} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


interface TeacherStatsIF{
    meetings_count: number,
    student_count: number,
};

interface MeetingsIF{
    isActive: boolean,
    meeting_time_ist: string,
    password: string,
    participants: string[],
    MEETING_ID: string,
    owner: string,
    description: string,
    url: string,
    duration: number,
    title: string,
    status: string,
    date: string,
    time: string,
    studentIds: string
}


export default function DashBoard() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);


    const [stats, setStats] = useState<TeacherStatsIF>({meetings_count: 0, student_count: 0});
    const [weeklyMeetings, setWeeklyMeetings] = useState<MeetingsIF[]>([]);
    const [historicMeetings, setHistoricMeetings] = useState<MeetingsIF[]>([]);


    const getStatusColor = (status: string) => {
        switch (status) {
        case 'scheduled': return 'bg-blue-500 text-blue-700';
        case 'ongoing': return 'bg-green-500 text-green-700';
        case 'completed': return 'bg-gray-500 text-gray-700';
        case 'cancelled': return 'bg-red-500 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
        }
    };


    const navigate = useNavigate();

     const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % weeklyMeetings.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + weeklyMeetings.length) % weeklyMeetings.length);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 75) {
            nextSlide();
        }

        if (touchStart - touchEnd < -75) {
        prevSlide();
        }
    };



  const recentAssignments = [
    { title: 'Quadratic Equations Quiz', subject: 'Mathematics', submitted: 18, total: 25, dueDate: 'Today' },
    { title: 'Newton\'s Laws Project', subject: 'Physics', submitted: 12, total: 18, dueDate: 'Tomorrow' },
    { title: 'Chemical Bonding Worksheet', subject: 'Chemistry', submitted: 20, total: 22, dueDate: 'Yesterday' }
  ];

  const fetchData = async(token: string) => {

    try{

        const statsResponse = await axios.get(`${import.meta.env.VITE_MEETINGS_API}/meetings/fetch-aggregates`, {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const weeklyMeetingsResponse = await axios.get(`${import.meta.env.VITE_MEETINGS_API}/meetings/fetch-teachers-meetings`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const historicMeetingsResponse = await axios.get(`${import.meta.env.VITE_MEETINGS_API}/meetings/fetch-historical-meetings`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        setStats(statsResponse.data);
        setWeeklyMeetings(weeklyMeetingsResponse.data.data);
        setHistoricMeetings(historicMeetingsResponse.data.meetings);

    }catch(error){
        if(axios.isAxiosError(error)){
            alert(`ERROR WHILE FETCHING DATA: ${error.message}`)
        }else{
            alert(`UNKNOWN ERROR: ${error}`);
        };
    };
  };



  useEffect(() => {
    const value = sessionStorage.getItem("B2P-TEACHER-ACCESS-TOKEN");
    const token = value ? JSON.parse(value) : null;
    const date = Date.now();
    if (!token || date > token.expiry) {
      navigate("/");
    } else {
      console.log(token);
      fetchData(token.token);
    }
  }, []);



  return (
    <div className="min-h-screen background-image">
        <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-white">Teacher Dashboard</h1>
          <p className="text-gray-600 text-white">Welcome back! Here's what's happening in your classroom today.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <Users />
                    </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1 capitalize">onboarded students</div>
                    <div className="text-xl text-gray-600">{stats.student_count}</div>
                </div>
            </div>

            <div className="">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <Video />
                    </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">Your Meetings</div>
                    <div className="text-xl text-gray-600">{stats.meetings_count}</div>
                </div>
            </div>

            <div className="">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <DollarSign />
                    </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Your Earnings</div>
                    <div className="text-xl text-gray-600">{0}</div>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                {/* Recent Assignments */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Upcoming Meetings</h2>
                    </div>
                    <div className="space-y-4">
                        {
                            historicMeetings.length !== 0 ?
                                <div className="">
                                    {
                                        historicMeetings.map((meeting, key) => (
                                            <div key={key} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900 capitalize">{meeting.title}</h3>
                                                            {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                                                                {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                                                            </span> */}
                                                        </div>

                                                        {meeting.description && (
                                                            <p className="text-sm text-gray-600 mb-3 capitalize">{meeting.description}</p>
                                                        )}

                                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                                <span>Date: {meeting.date}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Clock className="w-4 h-4 text-green-500" />
                                                                <span>{meeting.duration} minutes</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Users className="w-4 h-4 text-orange-500" />
                                                                <span>{meeting.studentIds? meeting.studentIds.length : null} students</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link to={meeting.url} target="_blank">
                                                    <button className={`w-full mt-3 py-2 ${getStatusColor(meeting.status)} text-white rounded-lg capitalize `}>
                                                        {meeting.status}
                                                    </button>
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                <div className="px-[1rem] py-[2rem]">
                                    <h1 className="text-center">No Meetings Found</h1>
                                </div>
                        }
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                {/* Today's Schedule */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={prevSlide}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                aria-label="Previous class"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                aria-label="Next class"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>
                    </div>
                    <div className="">
                        {
                            weeklyMeetings.length !== 0 ?
                                <div className="">

                                    <div className="relative overflow-hidden">
                                        <div
                                            className="flex transition-transform duration-300 ease-in-out"
                                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                            onTouchStart={handleTouchStart}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={handleTouchEnd}
                                        >
                                            {weeklyMeetings.map((classItem, index) => (
                                                <div key={index} className="min-w-full px-1">
                                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="font-medium text-gray-900 capitalize">{classItem.title}</h3>
                                                            <Clock className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Time:</span>
                                                                <span>{classItem.meeting_time_ist.split(" ")[1]}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>No.Of Students:</span>
                                                                <span>{classItem.participants.length}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Duration:</span>
                                                                <span>{classItem.duration} Mins</span>
                                                            </div>
                                                        </div>
                                                        <Link to={classItem.url} target="_blank">
                                                            <button className="w-full mt-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                                                Join Class
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-2 mt-4">
                                        {weeklyMeetings.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    index === currentIndex ? 'bg-blue-500 w-6' : 'bg-gray-300'
                                                    }`}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                :
                                <div className="">
                                    <h1 className="">No Meetings for Today</h1>
                                </div>
                        }
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Summary</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                            <div className="text-sm text-gray-600 mb-1">This Month</div>
                            <div className="text-2xl font-bold text-gray-900 mb-2">$2,847</div>
                            <div className="text-sm text-green-600">+18% from last month</div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Pending Payments</span>
                                <span className="font-medium text-gray-900">$340</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Next Payment</span>
                                <span className="font-medium text-gray-900">Mar 15</span>
                            </div>
                        </div>
                        <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                            View Payment Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}