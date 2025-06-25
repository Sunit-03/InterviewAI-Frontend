import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import SummaryCard from '../../components/Cards/SummaryCard';
import { CARD_BG } from '../../utils/data';
import moment from 'moment';
import Modal from '../../components/Modal';
import CreateSessionForm from './CreateSessionForm';
import DeleteAlert from '../../components/DeleteAlert';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [sessions, setSessions] = useState([]);

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        open: false,
        data: null
    });

    const fetchAllSessions = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.SESSIONS.GET_ALL)
            setSessions(response.data.sessions || []);
        } catch (error) {
            console.log("Error fetching sessions:", error);
        }
    }

    const deleteSession = async (sessionId) => {
        try {
            await axiosInstance.delete(API_PATHS.SESSIONS.DELETE(sessionId?._id));
            toast.success('Session deleted successfully');

            setOpenDeleteAlert({
                open: false,
                data: null
            });
            fetchAllSessions();
        } catch (error) {
            console.log("Error deleting session data", error);
        }
    }

    useEffect(()=>{
        fetchAllSessions();
    },[]);

  return (
    <DashboardLayout>
        <div className='container mx-auto pt-4 pb-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-2'>
                {sessions?.map((data,index) => (
                    <SummaryCard
                    key={data?._id}
                    colors={CARD_BG[index % CARD_BG.length]}
                    role={data?.role || ""}
                    topicsForFocus={data?.topicsForFocus || []}
                    experience={data?.experience || "-"}
                    questions={data?.questions || "-"}
                    description={data?.description || "-"}
                    lastUpdated={data?.updatedAt ? moment(data.updatedAt).format('DD MMM YYYY') : "-"}
                    onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                    onDelete={() => {
                        setOpenDeleteAlert({
                            open: true,
                            data
                        });
                    }}
                    />
                ))}
            </div>
            <button className='h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#ff9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-xs hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover-shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20' onClick={() => setOpenCreateModal(true)}>
                <span className='text-2xl text-white'>+</span> Add New
            </button>
        </div>
        <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
        >
            <div>
                <CreateSessionForm/>
            </div>
        </Modal>
        <Modal
        isOpen={openDeleteAlert?.open}
        onClose={()=>{setOpenDeleteAlert({open: false, data: null})}}
        title='Delete alert'
        >
            <div className='w-[30vw]'>
                <DeleteAlert content='Are you sure you want to delete the session' onDelete={()=>deleteSession(openDeleteAlert.data)}/>
            </div>
        </Modal>
    </DashboardLayout>
  )
}

export default Dashboard