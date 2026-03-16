console.log("hello harsh");
//adding comment here
function add(a,num1){
    return a+num1
}


import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-date-picker";
import { format, getDate } from "date-fns";
import { FaCalendar, FaTimes } from "react-icons/fa";
import ReactMonthPicker from "react-month-picker";
import "react-month-picker/css/month-picker.css";
import { BASEURL } from "./BASEURL";
import HashLoader from "react-spinners/HashLoader";
import Modal from "react-modal";
import { GrNext, GrPrevious } from "react-icons/gr";
// import { useLoadingContext } from "react-router-loading";
import Select from "react-select";
import ProductivityChart from "./ProductivityChart";
import AttendanceChart from "./AttendanceChart";
import reload from "../reload.png";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TicketsChart from "./report/TicketsChart";
import { Link } from "react-router-dom";
import { isAdminUser, isHRUser, isManagerUser } from "../utils/Utils";
import WorkAnniversaryCard from "./dashboard/WorkAnniversaryCard";
import BirthdayCard from "./dashboard/BirthdayCard";
import MarriageAnniversaryCard from "./dashboard/MarriageAnniversaryCard";
import HrJob from "./Hrdashboard/HrJob";
import TimeAgo from "./TimeAgo";
import { Skeleton } from "antd";
import dayjs from "dayjs";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "60%",
        padding: "0%",
        borderRadius: "5px",
    },
};

const Home = (props) => {
    // const loadingContext = useLoadingContext();
    let today = new Date();
    let month = [];
    month[0] = "1";
    month[1] = "2";
    month[2] = "3";
    month[3] = "4";
    month[4] = "5";
    month[5] = "6";
    month[6] = "7";
    month[7] = "8";
    month[8] = "9";
    month[9] = "10";
    month[10] = "11";
    month[11] = "12";

    let monthNumber = month[today.getMonth()];

    let [loading, setLoading] = useState(false);
    let [loadingDA, setLoadingDA] = useState(false);
    let [loadingTC, setLoadingTC] = useState(false);
    let [loadingJA, setLoadingJA] = useState(false);
    let [loadingTic, setLoadingTic] = useState(false);
    let [loadingBD, setLoadingBD] = useState(false);
    let [loadingHD, setLoadingHD] = useState(false);
    let [loadingTP, setLoadingTP] = useState(false);
    let [loadingAE, setLoadingAE] = useState(false);
    let [loadingP, setLoadingP] = useState(false);
    let [dateloading, setdateLoading] = useState(false);
    const [date, setdate] = useState(new Date());
    const [isVisible, setisVisible] = useState(false);
    const [rulesPerformanceData, setRulesPerformanceData] = useState(false);
    const [holidayisVisible, setholidayisVisible] = useState(false);
    const [prodisVisible, setprodisVisible] = useState(false);
    const [monthYear, setmonthYear] = useState({});
    const [timesheetCount, setTimesheetCount] = useState();
    const [jobApplicationCount, setJobApplicationCount] = useState();
    const [TotalApplicationCount, setTotalApplicationCount] = useState();
    const [absentDataView, setAbsentDataView] = useState();
    const [monthwiseLoading, setMonthwiseLoading] = useState(false);
    const [projectCount, setProjectCount] = useState()
    const day = new Date();
    const formatted = day.toISOString().split("T")[0]; // "yyyy-MM-dd"
    const [selectedDate, setSelectedDate] = useState(formatted);
    const [taskCount, setTaskCount] = useState()
    let currmonth = monthNumber;
    let curryear = today.getFullYear();
    const [selectedmonth, setselectedmonth] = useState({
        year: curryear,
        month: currmonth,
    });
    const holidaycurrmonth = monthNumber;
    const holidaycurryear = today.getFullYear();

    const prodcurrmonth = monthNumber;
    const prodcurryear = today.getFullYear();
    const [activeTab, setActiveTab] = useState("tab1");
    const [bdaydata, setbdaydata] = useState([]);
    const [holidaydata, setholidaydata] = useState([]);
    const [attdata, setattdata] = useState([]);
    const [proddata, setproddata] = useState([]);
    const [attdencedata, setattendencedata] = useState(null);
    const [monthTwo, setMonthTwo] = useState();
    const [ticketData, setTicketData] = useState([]);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [absentmodalIsOpen, setabsentIsOpen] = React.useState(false);
    const [onleavemodalIsOpen, setleaveIsOpen] = React.useState(false);
    const [unknownAbsentModalIsOpen, setUnknownAbsentModalIsOpen] =
        React.useState(false);
    const [activeBtn, setActiveBtn] = useState("M");
    const [startDateSelected, setStartDateSelected] = useState("");
    const [endDate, setEndDate] = useState("");
    const [anniversaries, setAnniversaries] = useState([]);
    const [lateArrivedModalIsOpen, setLateArrivedIsOpen] =
        React.useState(false);
    const [punchData, setPunchData] = useState({
        jobpunchdata: {
            job_in_time: "00:00:00",
            lunch_in_time: "00:00:00",
            lunch_out_time: "00:00:00",
            job_out_time: "00:00:00"
        },
        punchdata: []
    });
    const [pendingProfileData, setPendingProfileData] = useState([]);
    const [loadingPP, setLoadingPP] = useState(false);
    const [expandedUser, setExpandedUser] = useState(null);
    const top5 = useMemo(() => {
        if (!attdencedata) return [];

        const updated = attdencedata
            .filter((element) => {
                // Ensure device_type includes '0'
                const types = element.device_type?.toString().split(',') || [];
                return types.includes('0');
            })
            .map((element) => {
                const [hours, minutes, seconds] = element.prod.split(':').map(Number);
                const decimalTime = hours + minutes / 60 + seconds / 3600;
                return { ...element, decimaltime: Number(decimalTime.toFixed(2)) };
            });

        return updated
            .sort((a, b) => b.decimaltime - a.decimaltime)
            .slice(0, 5);
    }, [attdencedata]);
    const getYearsCompleted = (joinDate) => {
        const join = new Date(joinDate);
        const today = new Date();
        return today.getFullYear() - join.getFullYear();
    };
    useEffect(() => {
        localStorage.removeItem("monthyear");
        fetchData();
    }, []);

    const [processedWorkAnniversaryData, setProcessedWorkAnniversaryData] = useState([]);
    const [processedBirthdayData, setProcessedBirthdayData] = useState([]);
    const [processedMarriageAnniversaryData, setProcessedMarriageAnniversaryData] = useState([]);
    const [marriageAnniversaryData, setMarriageAnniversaryData] = useState([]);

    useEffect(() => {
        if (anniversaries && anniversaries.length > 0) {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentDate = today.getDate();

            const processedData = anniversaries.map(emp => {
                const joinDate = new Date(emp.date_of_joining);
                const joinMonth = joinDate.getMonth();
                const joinDay = joinDate.getDate();

                // Calculate days until anniversary
                const thisYearAnniversary = new Date(today.getFullYear(), joinMonth, joinDay);
                let daysUntil = Math.ceil((thisYearAnniversary - today) / (1000 * 60 * 60 * 24));

                if (daysUntil < 0) {
                    const nextYearAnniversary = new Date(today.getFullYear() + 1, joinMonth, joinDay);
                    daysUntil = Math.ceil((nextYearAnniversary - today) / (1000 * 60 * 60 * 24));
                }

                const isToday = joinMonth === currentMonth && joinDay === currentDate;
                const yearsCompleted = today.getFullYear() - joinDate.getFullYear();

                return {
                    ...emp,
                    daysUntil,
                    isToday,
                    yearsCompleted,
                    formattedDate: joinDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                    })
                };
            });

            processedData.sort((a, b) => {
                if (a.isToday && !b.isToday) return -1;
                if (!a.isToday && b.isToday) return 1;
                return a.daysUntil - b.daysUntil;
            });

            setProcessedWorkAnniversaryData(processedData);
        }
    }, [anniversaries]);

    useEffect(() => {
        if (bdaydata && bdaydata.length > 0) {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentDate = today.getDate();

            const processedData = bdaydata.map(emp => {
                const birthDate = new Date(emp.birthDate || emp.dob || emp.birthday);
                const birthMonth = birthDate.getMonth();
                const birthDay = birthDate.getDate();

                // Calculate days until birthday
                const thisYearBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
                let daysUntil = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));

                // If birthday passed this year, calculate for next year
                if (daysUntil < 0) {
                    const nextYearBirthday = new Date(today.getFullYear() + 1, birthMonth, birthDay);
                    daysUntil = Math.ceil((nextYearBirthday - today) / (1000 * 60 * 60 * 24));
                }

                const isToday = birthMonth === currentMonth && birthDay === currentDate;


                return {
                    ...emp,
                    birthMonth,
                    birthDay,
                    daysUntil,
                    isToday,
                    formattedDate: birthDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                    })
                };
            });

            // Sort by days until birthday (today's birthdays first)
            processedData.sort((a, b) => {
                if (a.isToday && !b.isToday) return -1;
                if (!a.isToday && b.isToday) return 1;
                return a.daysUntil - b.daysUntil;
            });

            setProcessedBirthdayData(processedData);
        }
    }, [bdaydata]);

    useEffect(() => {
        if (marriageAnniversaryData && marriageAnniversaryData.length > 0) {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentDate = today.getDate();

            const processedData = marriageAnniversaryData.map(emp => {
                const marriageDate = new Date(emp.marriage_anniversary);
                const marriageMonth = marriageDate.getMonth();
                const marriageDay = marriageDate.getDate();

                // Calculate days until anniversary
                const thisYearAnniversary = new Date(today.getFullYear(), marriageMonth, marriageDay);
                let daysUntil = Math.ceil((thisYearAnniversary - today) / (1000 * 60 * 60 * 24));

                // If anniversary passed this year, calculate for next year
                if (daysUntil < 0) {
                    const nextYearAnniversary = new Date(today.getFullYear() + 1, marriageMonth, marriageDay);
                    daysUntil = Math.ceil((nextYearAnniversary - today) / (1000 * 60 * 60 * 24));
                }

                const isToday = marriageMonth === currentMonth && marriageDay === currentDate;
                const yearsCompleted = today.getFullYear() - marriageDate.getFullYear();

                return {
                    ...emp,
                    daysUntil,
                    isToday,
                    yearsCompleted,
                    formattedDate: marriageDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                    })
                };
            });

            // Sort by days until anniversary (today's first)
            processedData.sort((a, b) => {
                if (a.isToday && !b.isToday) return -1;
                if (!a.isToday && b.isToday) return 1;
                return a.daysUntil - b.daysUntil;
            });

            setProcessedMarriageAnniversaryData(processedData);
        }
    }, [marriageAnniversaryData]);

    const getAniversary = () => {
        try {
            fetch(BASEURL + `getAnniversary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ company_uuid: JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid }),
            }).then(response => response.json())
                .then(data => {
                    setAnniversaries(data.data);
                });
        } catch (error) {
            console.error(error);

        }
    }

    const [orgs, setorgs] = React.useState([]);
    const [master] = React.useState(
        JSON.parse(localStorage.getItem("isAuth")).master
    );
    const [selectedorg, setselectedorg] = React.useState(
        JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid
    );
    const [orgval, setorgval] = React.useState([]);
    const departmentId = JSON.parse(localStorage.getItem("isAuth"))?.department
    const absentData = async () => {
        setLoadingAE(true);
        const data = JSON.parse(localStorage.getItem("isAuth"));

        try {
            const res = await fetch(BASEURL + 'get-absent-emp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ company_uuid: data?.companydata[0]?.uuid, department: data?.department, username: data?.username }),
            }).then(response => response.json());

            setAbsentDataView(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAE(false);
        }
    };

    const companyId = JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid
    const userId = JSON.parse(localStorage.getItem("isAuth")).username
    // useEffect(() => {
    //   // let mode=props.isdarmode()
    //   // ahi update nai avti value ni
    // }, [props.toggle]);
    useEffect(() => {
        let value = JSON.parse(localStorage.getItem("monthyear"));
        // const month = value ? value.month : format(new Date(), "MM");
        // const year = value ? value.year : format(new Date(), "yyyy");
        const month = format(new Date(), "MM");
        const year = format(new Date(), "yyyy");
        setselectedmonth({ year: year, month: month });

        setorgval({
            value: selectedorg,
            label: JSON.parse(localStorage.getItem("isAuth")).companydata[0]
                .name,
        });
        if (master === 1) {
            getOrganizations();
        }
        getBirthdayData({ year: year, month: month });
        getHolidayData({ year: year, month: month });
        getAttendanceData(format(new Date(), "yyyy-MM-dd"));
        timeSheetData(format(new Date(), "yyyy-MM-dd"));
        getProdData({ year: year, month: month });
        absentData()
        ProjectCount()
        TaskCount()
        getAniversary()
        getRulesDashboard()
        getMarriageAnniversary()
        getPendingProfileData();
    }, []);

    const ProjectCount = async () => {
        try {
            setLoadingP(true);
            let userdata = JSON.parse(localStorage.getItem("isAuth"));
            const response = await fetch(BASEURL + `departments/project-counts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ company_uuid: userdata?.companydata[0]?.uuid }), // Replace with dynamic value if needed
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setProjectCount(data);

        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        } finally {
            setLoadingP(false);
        }
    };

    const TaskCount = async () => {
        try {
            setLoadingP(true);

            const today = new Date();
            const endDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

            // Clone the date and subtract 6 months
            const pastDate = new Date(today);
            pastDate.setMonth(pastDate.getMonth() - 6);
            const startDate = pastDate.toISOString().split("T")[0]; // YYYY-MM-DD

            const response = await fetch(BASEURL + `get-monthwise-task-completed`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ startDate, endDate }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setTaskCount(data?.data);

        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        } finally {
            setLoadingP(false);
        }
    };

    const getPendingProfileData = async () => {
        setLoadingPP(true);
        try {
            const companyUuid = JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid;
            const res = await fetch(BASEURL + `pending-profile/${companyUuid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.success) {
                setPendingProfileData(data.data);
            }
        } catch (error) {
            console.error("Error fetching pending profile data:", error);
        } finally {
            setLoadingPP(false);
        }
    };

    // useEffect(() => {
    // 	if (activeBtn === 'D') {
    // 		let start = new Date();
    // 	}
    // 	else if (activeBtn === 'W') {
    // 		let start = new Date();
    // 		start = new Date(start.setDate(start.getDate() - start.getDay()));
    // 		let end = new Date(start);
    // 		end = new Date(end.setDate(end.getDate() + 6));
    // 	}
    // 	else if (activeBtn === 'Q') {
    // 		let start = new Date();
    // 		let endMonth = start.getMonth() + 1
    // 		let startMonth = (start.getMonth() - 1) <= 0 ? (12 + (start.getMonth() - 1)) : (start.getMonth() - 1)

    // 	}
    // 	else {
    // 	}
    // }, [activeBtn]);
    const fetchData = async () => {
        const isAuth = JSON.parse(localStorage.getItem("isAuth"))
        const payload = {
            username: isAuth?.username,
            proj_id: 0,
            act_id: 0
        };

        try {
            const res = await fetch(BASEURL + "api/get-punch-data", {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            const jobPunchData = data;
            if (jobPunchData) {
                setPunchData(jobPunchData);
            } else {
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        let start = new Date();
        let end = new Date();

        if (activeBtn === "D") {
            // Today
            start = format(start, "yyyy-MM-dd");
            end = start;
        } else if (activeBtn === "W") {
            // Last 7 days (including today)
            start.setDate(start.getDate() - 6);
            start = format(start, "yyyy-MM-dd");
            end = format(new Date(), "yyyy-MM-dd");
        } else if (activeBtn === "Q") {
            // Last 15 days
            start.setDate(start.getDate() - 15);
            start = format(start, "yyyy-MM-dd");
            end = format(new Date(), "yyyy-MM-dd");
        } else {
            // Last 30 days
            start.setDate(start.getDate() - 30);
            start = format(start, "yyyy-MM-dd");
            end = format(new Date(), "yyyy-MM-dd");
        }

        setStartDateSelected(start);
        setEndDate(end);

        jobApplicationData(start, end);
    }, [activeBtn]);


    const reloadFun = () => {
        let value = JSON.parse(localStorage.getItem("monthyear"));
        const month = value ? value.month : format(new Date(), "MM");
        const year = value ? value.year : format(new Date(), "yyyy");

        getOrganizations();
        getBirthdayData({ year: year, month: month });
        getHolidayData({ year: year, month: month });
        getAttendanceData(format(new Date(), "yyyy-MM-dd"));
        getProdData({ year: year, month: month });
    };

    function openModal() {
        setIsOpen(true);
    }
    function absentopenModal() {
        setabsentIsOpen(true);
        setIsOpen(false);
    }
    function leaveopenModal() {
        setleaveIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setabsentIsOpen(false);
        setleaveIsOpen(false);
    }

    function openLateArrivedModal() {
        setLateArrivedIsOpen(true);
    }

    function closeLateArrivedModal() {
        setLateArrivedIsOpen(false);
    }

    const getSummaryProductivity = () => {
        return <ProductivityChart proddata={monthTwo} />;
    };

    const getSummaryAttendance = () => {
        // return <AttendanceChart attdata={attdata} />;
        return <AttendanceChart attdata={mergedData}
            lateArrivedData={attdata?.latearrivedUsers}
            absentData={attdata?.absentusers}
            presentData={attdata?.presentusers}
            fulldayLeaveData={attdata?.fullday_leave_user}
            firstHalfLeaveData={attdata?.firsthalf_leave_user}
            secondHalfLeaveData={attdata?.secondhalf_leave_user}
            timeSheetUserWithEntry={timesheetCount?.usersWithEntry}
            timeSheetUserWithoutEntry={timesheetCount?.usersWithoutEntry}
            UpcomingLeaves={attdata?.upcoming_leave_data}
            date={selectedDate}
        />;
    };
    const mergedData = {
        ...attdata,
        withEntry: timesheetCount?.withEntry,
        withoutEntry: timesheetCount?.withoutEntry
    };


    const getSummaryTicket = () => {
        return <TicketsChart ticketData={ticketData} />;
    };

    function openUnknownAbsentModal() {
        setUnknownAbsentModalIsOpen(true);
    }

    function closeUnknownAbsentModal() {
        setUnknownAbsentModalIsOpen(false);
    }

    const handledate = (e) => {
        let date;
        if (e !== null) {
            setdate(e);
            date = format(new Date(e), "yyyy-MM-dd");
        } else {
            date = format(new Date(), "yyyy-MM-dd");
        }
        setSelectedDate(date)
        getAttendanceData(date);
        timeSheetData(date);
    };

    const nexTDay = () => {
        let tomorrow = date;
        tomorrow.setDate(date.getDate() + 1);

        setdate(tomorrow);
        let date2 = format(new Date(tomorrow), "yyyy-MM-dd");
        getAttendanceData(date2);
    };

    const prevDay = () => {
        let tomorrow = date;
        tomorrow.setDate(date.getDate() - 1);

        setdate(tomorrow);
        let date2 = format(new Date(tomorrow), "yyyy-MM-dd");
        getAttendanceData(date2);
    };

    const getMonthValue = () => {
        let value = JSON.parse(localStorage.getItem("monthyear"));
        const month = value
            ? value.monthname
            : monthYear && monthYear.month
                ? monthYear.month
                : 0;
        const year = value
            ? value.year
            : monthYear && monthYear.year
                ? monthYear.year
                : 0;

        let date = new Date();
        let curryear = date.getFullYear();

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        return month && year
            ? `${month}-${year}`
            : monthNames[currmonth - 1] + "-" + curryear;
    };

    const getHolidayMonthValue = () => {
        let value = JSON.parse(localStorage.getItem("monthyear"));
        const month = value
            ? value.monthname
            : monthYear && monthYear.month
                ? monthYear.month
                : 0;
        const year = value
            ? value.year
            : monthYear && monthYear.year
                ? monthYear.year
                : 0;

        let date = new Date();
        let curryear = date.getFullYear();

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        return month && year
            ? `${month}-${year}`
            : monthNames[currmonth - 1] + "-" + curryear;
    };

    const getProdMonthValue = () => {
        let value = JSON.parse(localStorage.getItem("monthyear"));
        const month = value
            ? value.monthname
            : monthYear && monthYear.month
                ? monthYear.month
                : 0;
        const year = value
            ? value.year
            : monthYear && monthYear.year
                ? monthYear.year
                : 0;

        let date = new Date();
        let curryear = date.getFullYear();

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        return month && year
            ? `${month}-${year}`
            : monthNames[currmonth - 1] + "-" + curryear;
    };

    const handleOnChange = (year, month) => {
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        let monthname = monthNames[month - 1];
        setisVisible(false);
        setprodisVisible(false);
        localStorage.setItem(
            "monthyear",
            JSON.stringify({ year, monthname, month: month })
        );
        setmonthYear({ year, month: monthname });
        setselectedmonth({ year, month: Number(month) });
        getBirthdayData({ year, month });
        getHolidayData({ year, month });
        getProdData({ year, month });
    };

    const handleHolidayOnChange = (year, month) => {
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        let monthname = monthNames[month - 1];
        setholidayisVisible(false);
        localStorage.setItem(
            "monthyear",
            JSON.stringify({ year, monthname, month: month })
        );

        getBirthdayData({ year, month });
        getHolidayData({ year, month });
        getProdData({ year, month });
    };

    const handleProdOnChange = (year, month) => {
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        let monthname = monthNames[month - 1];
        setisVisible(false);
        setprodisVisible(false);
        localStorage.setItem(
            "monthyear",
            JSON.stringify({ year, monthname, month: month })
        );

        getBirthdayData({ year, month });
        getHolidayData({ year, month });
        getProdData({ year, month });
    };

    const showMonthPicker = (e) => {
        setisVisible(!isVisible);
        e.preventDefault();
    };
    const hideMonthPicker = () => {
        setisVisible(false);
    };
    const showHolidayMonthPicker = (e) => {
        setholidayisVisible(true);
        e.preventDefault();
    };

    const showProdMonthPicker = (e) => {
        setprodisVisible(true);
        e.preventDefault();
    };
    const handleOnDismiss = () => {
        setisVisible(false);
        setholidayisVisible(false);
        setprodisVisible(false);
    };

    const getBirthdayData = async ({ year, month, org = "" }) => {
        setLoadingBD(true);

        let pmonth;
        if (year === "") {
            pmonth = format(new Date(), "MM");
        } else {
            pmonth = month;
        }
        let pyear;
        if (year === "") {
            pyear = format(new Date(), "yyyy");
        } else {
            pyear = year;
        }

        const myHeaders = new Headers();
        let userdata = JSON.parse(localStorage.getItem("isAuth"));
        if (userdata !== null) {
            let token = userdata.usertoken;
            myHeaders.append("Authorization", token);
        }
        myHeaders.append("Content-Type", "application/json");
        await fetch(BASEURL + `get-birthdaydata/`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                month: pmonth,
                year: pyear,
                uuid: org !== "" ? org : selectedorg,
                usertype: JSON.parse(localStorage.getItem("isAuth")).type,
                department: JSON.parse(localStorage.getItem("isAuth"))
                    .department,
                // uuid: setselectedorg!=="" ? selectedorg :JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid,
                // uuid: setselectedorg!=="" ? selectedorg :JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid,
            }),
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status === 201) {
                    function compare(a, b) {
                        if (
                            new Date(a.dob).toString().slice(8, 10) <
                            new Date(b.dob).toString().slice(8, 10)
                        ) {
                            return -1;
                        }
                        if (
                            new Date(a.dob).toString().slice(8, 10) >
                            new Date(b.dob).toString().slice(8, 10)
                        ) {
                            return 1;
                        }
                        return 0;
                    }

                    setbdaydata(res.data.sort(compare));
                } else {
                    setbdaydata([]);
                }
            })
            .catch((err) => console.error(err));

        setLoadingBD(false);
    };

    const getMarriageAnniversary = async () => {
        try {
            const response = await fetch(BASEURL + `getMarriageAnniversary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    company_uuid: JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid
                }),
            });
            const data = await response.json();

            if (data.status === 201) {
                setMarriageAnniversaryData(data.data);
            } else {
                setMarriageAnniversaryData([]);
            }
        } catch (error) {
            console.error("Error fetching marriage anniversary:", error);
            setMarriageAnniversaryData([]);
        }
    };


    const getRulesDashboard = async () => {
        setLoadingTP(true)
        try {
            let userdata = JSON.parse(localStorage.getItem("isAuth"));
            if (!userdata) return;

            const response = await fetch(BASEURL + "get-leaderboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: userdata.usertoken
                },
                body: JSON.stringify({
                    company_uuid: companyId,
                    date: selectedDate
                })
            });

            const res = await response.json();
            if (res.status === 200) setRulesPerformanceData(res?.data?.leaderboard?.by_daily_score, 'response');

        } catch (error) {
            console.error("Error fetching rules:", error);
        } finally {
            setLoadingTP(false)
        }
    };

    const getHolidayData = async ({ year, month, org = "" }) => {
        setLoading(true);

        let pmonth;
        if (year === "") {
            pmonth = format(new Date(), "MM");
        } else {
            pmonth = month;
        }
        let pyear;
        if (year === "") {
            pyear = format(new Date(), "yyyy");
        } else {
            pyear = year;
        }

        const myHeaders = new Headers();
        let userdata = JSON.parse(localStorage.getItem("isAuth"));
        if (userdata !== null) {
            let token = userdata.usertoken;
            myHeaders.append("Authorization", token);
        }
        myHeaders.append("Content-Type", "application/json");
        await fetch(BASEURL + `get-holidaydata/`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                month: pmonth,
                year: pyear,
                uuid: org !== "" ? org : selectedorg,
                // uuid: selectedorg
                // uuid: JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid,
                // uuid: setselectedorg!=="" ? selectedorg :JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid,
            }),
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status === 201) {
                    setholidaydata(res.data);
                } else {
                    setholidaydata([]);
                }
            })
            .catch((err) => console.error(err));

        setLoading(false);
    };

    const getOrganizations = async () => {
        setLoading(true);

        const myHeaders = new Headers();
        let userdata = JSON.parse(localStorage.getItem("isAuth"));
        if (userdata !== null) {
            let token = userdata.usertoken;
            myHeaders.append("Authorization", token);
        }
        myHeaders.append("Content-Type", "application/json");
        await fetch(BASEURL + `get-organizations/`, {
            method: "POST",
            headers: myHeaders,
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status === 201) {
                    setorgs(res.data);
                } else {
                    setorgs([]);
                }
            })
            .catch((err) => console.error(err));

        setLoading(false);
    };

    const getorg = async (org) => {
        setorgval(org);
        org = org.value;
        setselectedorg(org);
        let value = JSON.parse(localStorage.getItem("monthyear"));
        if (Object.keys(monthYear).length !== 0) {
            value = monthYear;
        }

        const month = value ? value.month : format(new Date(), "MM");
        const year = value ? value.year : format(new Date(), "yyyy");

        getBirthdayData({ year: year, month: month, org });
        getMarriageAnniversary()
        getHolidayData({ year: year, month: month, org });

        getAttendanceData(format(new Date(), "yyyy-MM-dd"), org);

        getProdData({ year: year, month: month, org });
    };

    const getAttendanceData = async (date, org = "") => {
        setdateLoading(true);
        setLoadingDA(true)
        const myHeaders = new Headers();
        let userdata = JSON.parse(localStorage.getItem("isAuth"));
        if (userdata !== null) {
            let token = userdata.usertoken;
            myHeaders.append("Authorization", token);
        }
        myHeaders.append("Content-Type", "application/json");
        await fetch(BASEURL + `get-attendancedata/`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                date,
                uuid: org !== "" ? org : selectedorg,
                usertype: JSON.parse(localStorage.getItem("isAuth")).type,
                department: JSON.parse(localStorage.getItem("isAuth"))
                    .department,
            }),
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status === 201) {
                    setattdata(res.arr[0]);
                } else {
                    setattdata([]);
                }
            })
            .catch((err) => console.error(err));

        setdateLoading(false);
        setLoadingDA(false)
    };

    const getProdData = async ({ year, month, org = "" }) => {
        setLoadingTic(true);
        let pmonth;
        if (year === "") {
            pmonth = format(new Date(), "MM");
        } else {
            pmonth = month;
        }
        let pyear;
        if (year === "") {
            pyear = format(new Date(), "yyyy");
        } else {
            pyear = year;
        }

        const myHeaders = new Headers();
        let userdata = JSON.parse(localStorage.getItem("isAuth"));
        if (userdata !== null) {
            let token = userdata.usertoken;
            myHeaders.append("Authorization", token);
        }
        myHeaders.append("Content-Type", "application/json");
        await fetch(BASEURL + `get-monthwise-productivity/`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                month: pmonth,
                year: pyear,
                // month: "07",
                // year: "2025",
                uuid: org !== "" ? org : selectedorg,
                usertype: JSON.parse(localStorage.getItem("isAuth")).type,
                // department: JSON.parse(localStorage.getItem("isAuth"))
                // 	.department,
                // uuid: selectedorg
                // uuid: JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid,
                // uuid: setselectedorg!=="" ? selectedorg :JSON.parse(localStorage.getItem("isAuth")).companydata[0].uuid,
            }),
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status === 201) {
                    setproddata(res.allarr[0]);
                    setattendencedata(res.data)
                    setMonthTwo(res);
                    setTicketData(res.ticketData)
                } else {
                    setproddata([]);
                    setTicketData()
                }
            })
            .catch((err) => console.error(err));

        setLoadingTic(false);
        // loadingContext.done();
    };

    const timeSheetData = async (date) => {
        setLoadingTC(true)
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const res = await fetch(BASEURL + 'timesheet-data', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    date, department: departmentId, company_uuid: companyId, username: userId
                })
            }).then(response => response.json())
            setTimesheetCount(res)
        } catch (error) {
            console.error(error);
        }
        setLoadingTC(false)
    }

    const jobApplicationData = async (startDate, endDate) => {
        setLoadingJA(true)
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const res = await fetch(BASEURL + 'application-stats', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate,
                })
            }).then(response => response.json())
            setJobApplicationCount(res)
            setTotalApplicationCount(res.totalApplication)
        } catch (error) {
            console.error(error);
        }
        setLoadingJA(false)
    }
    let totalDecimalHours = 0;
    const breaks = punchData.breaksdata || [];
    function decimalToTime(decimalHours) {
        const totalSeconds = Math.floor(decimalHours * 3600); // total seconds
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format with leading zeroes
        return [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(seconds).padStart(2, '0'),
        ].join(':');
    }
    breaks.forEach(breakEntry => {
        const start = dayjs(`2025-06-04T${breakEntry.start_time}`);
        const end = dayjs(`2025-06-04T${breakEntry.end_time}`);
        const diffInMinutes = end.diff(start, 'minute', true); // accurate to decimals
        totalDecimalHours += diffInMinutes / 60; // convert minutes to decimal hours
    });
    const totalFormattedTime = decimalToTime(totalDecimalHours);

    return (
        <>
            {(isManagerUser() || isAdminUser()) &&
                <div className="flex">
                    <button
                        onClick={() => setActiveTab("tab1")}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: activeTab === "tab1" ? "#245aa1ff" : "#fff",
                            color: activeTab === "tab1" ? "#fff" : "#000",
                            border: "1px solid #ccc",
                            borderTopLeftRadius: "6px",
                            borderBottomLeftRadius: "6px",
                        }}
                    >
                        Company Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab("tab2")}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: activeTab === "tab2" ? "#245aa1ff" : "#fff",
                            color: activeTab === "tab2" ? "#fff" : "#000",
                            border: "1px solid #ccc",
                            borderTopRightRadius: "6px",
                            borderBottomRightRadius: "6px",
                        }}
                    >
                        HR Dashboard
                    </button>
                </div>}
            {activeTab === "tab1" && (
                <>
                    <div className="col-span-12 lg:col-span-12 sm:col-span-12 mt-0">
                        <div className="intro-y block flex justify-end ">
                            {/* {master === 1 && ( */}
                            <>
                                <div className="flex items-center sm:ml-auto mt-3 sm:mt-0 mr-3">
                                    <DatePicker
                                        clearIcon=""
                                        calendarIcon={
                                            <FaCalendar
                                                style={{
                                                    color: "rgb(30 64 175)",
                                                }}
                                            />
                                        }
                                        onChange={handledate}
                                        value={date}
                                    />
                                </div>
                                <div className="flex mt-2 sm:mt-0">
                                    <div className="input-group mr-2 calenderdate">
                                        <input
                                            type="text"
                                            style={{
                                                fontSize:
                                                    "12px",
                                            }}
                                            onFocus={(e) =>
                                                showMonthPicker(
                                                    e
                                                )
                                            }
                                            value={getMonthValue()}
                                            onDismiss={() =>
                                                hideMonthPicker(
                                                    false
                                                )
                                            }
                                            className="form-control calenderdate1 "
                                            id="basic-url"
                                            aria-describedby="basic-addon3"
                                        />
                                        <div className="input-group-append calendaricon">
                                            <FaCalendar
                                                style={{
                                                    fontSize:
                                                        "12px",
                                                }}
                                                onClick={(
                                                    e
                                                ) =>
                                                    showMonthPicker(
                                                        e
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <ReactMonthPicker
                                        show={isVisible}
                                        lang={[
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec",
                                        ]}
                                        value={
                                            selectedmonth
                                        }
                                        onChange={
                                            handleOnChange
                                        }
                                        onDismiss={
                                            handleOnDismiss
                                        }
                                    />
                                </div>
                            </>
                            {/* )} */}
                        </div>
                    </div>
                    <div className="mt-3">
                        {processedWorkAnniversaryData?.length > 0 && (
                            <WorkAnniversaryCard
                                processedWorkAnniversaryData={processedWorkAnniversaryData}
                            />
                        )}
                    </div>

                    <div className="mt-3">
                        {/* Birthday Card */}
                        {processedBirthdayData?.length > 0 && (
                            <BirthdayCard
                                processedBirthdayData={processedBirthdayData}
                            />
                        )}
                    </div>

                    <div className="mt-3">
                        {/* Marriage Anniversary Card */}
                        {processedMarriageAnniversaryData?.length > 0 && (
                            <MarriageAnniversaryCard
                                processedMarriageAnniversaryData={processedMarriageAnniversaryData}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-12 gap-1">
                        <div className="custom-col-12 col-span-6 2xl:col-span-6 sm:col-span-12 xs:col-span-12 text-left p-1">

                            <div className="col-span-12 mt-2">
                                <div
                                    style={{
                                        border: "1px solid #FC9A30",
                                        borderRadius: "5px",
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#FC9A30",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                            position: "relative",
                                            zIndex: 2,
                                        }}
                                    >
                                        Daily Attendance Statistics
                                    </h2>
                                    {dateloading ? (
                                        <div className="flex justify-center mt-5 mb-5">
                                            <HashLoader
                                                color="#5755d9"
                                                size={30}
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-12">
                                            <div className="col-span-12 p-2">
                                                {getSummaryAttendance()}
                                            </div>
                                            {/* You can add a z-index here to manage order of sections */}
                                            {/* <div
                                        className="col-span-12 p-2"
                                        style={{
                                            display: "flex",
                                            alignItems: "start",
                                            justifyContent: 'center',
                                            position: "relative", // Added position to allow z-index to take effect
                                            zIndex: 0, // Default z-index for this section
                                        }}
                                    >
                                        <div
                                            className="flex"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: 'center',
                                                marginTop: "20px",
                                                position: "relative", // Ensuring z-index applies here as well
                                                zIndex: 0, // Adjust z-index here if needed to control stacking
                                            }}
                                        >
                                            <div className="attendance-container">
                                                <h1 className="attendance-box">
                                                    <span style={{ color: "#1D46AC" }}>Total Employee</span>
                                                    {attdata && attdata.totalmembers}
                                                </h1>
    
                                                <h1 className="attendance-box">
                                                    <span style={{ color: "#FC9A30" }}>Leave</span>
                                                    {attdata && attdata.onleaveCount}
                                                </h1>
    
                                                <h1 className="attendance-box">
                                                    <span style={{ color: "#24A184" }}>Present</span>
                                                    {attdata && attdata.present}
                                                </h1>
    
                                                <h1 className="attendance-box">
                                                    <span style={{ color: "#2EDCFE" }}>Late Arrived</span>
                                                    {attdata && attdata.latearrived ? attdata.latearrived : 0}
                                                </h1>
    
                                                <h1 className="attendance-box">
                                                    <span style={{ color: "#FB7474" }}>Absent</span>
                                                    {attdata && attdata.absent}
                                                </h1>
    
                                                <h1 className="attendance-box">
                                                    <span style={{ color: "#745555" }}>Unknown/Absent</span>
                                                    {attdata && attdata.unknownAbsentUsers
                                                        ? `${attdata.unknownAbsentUsers.length}`
                                                        : "0 Count"}
                                                </h1>
                                            </div>
                                        </div>
                                    </div> */}
                                        </div>)}
                                </div>
                                {/* <div
                                style={{
                                    border: "1px solid #24A184",
                                    borderRadius: "5px",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                <h2
                                    style={{
                                        background: "#24A184",
                                        borderRadius: "2px",
                                        fontSize: "15px",
                                        padding: "10px",
                                        fontWeight: 500,
                                        color: "#fff",
                                        textAlign: "start",
                                    }}
                                >
                                    Monthly Tickets
                                </h2>
    
                                <div className="grid grid-cols-12">
                                    {loadingTic ? (
                                        <div className="col-span-12 sm:col-span-12" >
                                            <div className="flex justify-center mt-5 mb-5">
                                                <HashLoader
                                                    color="#5755d9"
                                                    size={30}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-span-12 sm:col-span-12 p-2" >{getSummaryProductivity()}</div>)}
                            
    
                                </div>
                            </div>
                         */}
                            </div>
                            {/* <div className="col-span-12 mt-2">
                            <div
                                style={{
                                    border: "1px solid #1D46AC",
                                    borderRadius: "5px",
                                }}
                            >
                                <h2
                                    style={{
                                        background: "#1D46AC",
                                        borderRadius: "2px",
                                        fontSize: "15px",
                                        padding: "10px",
                                        fontWeight: 500,
                                        color: "#fff",
                                        textAlign: "start",
                                    }}
                                >
                                    Project
                                </h2>
                                <div className="intro-y mt-5 sm:mt-2 p-3">
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                                            <tr>
                                                <th className="whitespace-nowrap p-3">Project Name</th>
                                                <th className="whitespace-nowrap p-3">Team Member</th>
                                                <th className="whitespace-nowrap p-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: "1px solid #ccc" }}>
                                                <td className="" style={{ padding: "10px" }}>
                                                    HR Project
                                                </td>
                                                <td className="" style={{ padding: "10px" }}>
                                                    Vinit Shah
                                                </td>
                                                <td className="" style={{ padding: "10px" }}>
                                                    Active
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: "1px solid #ccc" }}>
                                                <td className="" style={{ padding: "10px" }}>
                                                    TradeIQ
                                                </td>
                                                <td className="" style={{ padding: "10px" }}>
                                                    Harsh Mistry
                                                </td>
                                                <td className="" style={{ padding: "10px" }}>
                                                    Active
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="" style={{ padding: "10px" }}>
                                                    Account
                                                </td>
                                                <td className="" style={{ padding: "10px" }}>
                                                    Milan Kareliya
                                                </td>
                                                <td className="" style={{ padding: "10px" }}>
                                                    Active
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> */}


                            <div className="col-span-12 mt-2">
                                <div
                                    style={{
                                        border: "1px solid rgb(255, 196, 53)",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "rgb(255, 196, 53)",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Most Productive Employee
                                    </h2>
                                    {loadingTic ? (
                                        <div className="flex justify-center mt-5 mb-5">
                                            <HashLoader
                                                color="#5755d9"
                                                size={30}
                                            />
                                        </div>
                                    ) : (
                                        <div className="intro-y mt-5 sm:mt-2 p-3">
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead style={{ backgroundColor: "#f8f9fa" }}>
                                                    <tr>
                                                        <th className="whitespace-nowrap p-3">Employee Name</th>
                                                        <th className="text-center whitespace-nowrap p-3">Monthly</th>
                                                        <th className="text-center whitespace-nowrap p-3">Daily</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {top5 && top5.length > 0 ? (
                                                        top5.map((item, i) => (
                                                            <tr key={i}>
                                                                <td className="p-3" style={{ padding: "10px" }}>
                                                                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5 text-left">
                                                                        {item?.employee}
                                                                    </div>
                                                                </td>
                                                                <td className="text-center" style={{ padding: "10px" }}>
                                                                    {/* {format(new Date(item.dob), "dd MMM, yyyy")} */}
                                                                    {item?.prod}
                                                                </td>
                                                                <td className="text-center" style={{ padding: "10px" }}>
                                                                    {/* {format(new Date(item.dob), "dd MMM, yyyy")} */}
                                                                    {item?.todayEffectiveDuration}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr className="intro-x">
                                                            <td colSpan={2}>
                                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    No data Found
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>)}
                                </div>
                            </div>
                            <div className="col-span-12 mt-2">
                                <div
                                    style={{
                                        border: "1px solid #9e82e0",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#9e82e0",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Top Performance
                                    </h2>
                                    {loadingTP ? (
                                        <div className="flex justify-center mt-5 mb-5">
                                            <HashLoader
                                                color="#5755d9"
                                                size={30}
                                            />
                                        </div>
                                    ) : (
                                        <div className="intro-y mt-5 sm:mt-2 p-3">
                                            <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                                                        <tr>
                                                            <th className="whitespace-nowrap p-3">Employee Name</th>
                                                            <th className="text-center whitespace-nowrap p-3">Monthly Score</th>
                                                            <th className="text-center whitespace-nowrap p-3">Daily Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {rulesPerformanceData && rulesPerformanceData.length > 0 ? (
                                                            rulesPerformanceData.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="p-3" style={{ padding: "10px" }}>
                                                                        <div className="underlined-grey text-slate-500 cursor-pointer text-xs whitespace-nowrap mt-0.5 text-left">
                                                                            <Link to={`/performance/${item?.user_uuid}`}>
                                                                                {item?.user_name}
                                                                            </Link>
                                                                        </div>
                                                                    </td>
                                                                    <td className="text-center" style={{ padding: "10px" }}>
                                                                        {/* {format(new Date(item.dob), "dd MMM, yyyy")} */}
                                                                        {item?.monthly_percentage?.percentage}
                                                                    </td>
                                                                    <td className="text-center" style={{ padding: "10px" }}>
                                                                        {/* {format(new Date(item.dob), "dd MMM, yyyy")} */}
                                                                        {item?.daily_score}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr className="intro-x">
                                                                <td colSpan={2}>
                                                                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                        No data Found
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>)}
                                </div>
                            </div>
                            <div className="col-span-12 mt-2">
                                <div
                                    style={{
                                        border: "1px solid #44A7F1",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#44A7F1",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Birthday
                                    </h2>
                                    {loadingBD ? (
                                        <div className="flex justify-center mt-5 mb-5">
                                            <HashLoader
                                                color="#5755d9"
                                                size={30}
                                            />
                                        </div>
                                    ) : (
                                        <div className="intro-y mt-5 sm:mt-2 p-3">
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead style={{ backgroundColor: "#f8f9fa" }}>
                                                    <tr>
                                                        <th className="whitespace-nowrap p-3">Employee Name</th>
                                                        <th className="text-center whitespace-nowrap p-3">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bdaydata && bdaydata?.length > 0 ? (
                                                        bdaydata?.map((item, i) => (
                                                            <tr key={i}>
                                                                <td className="p-3" style={{ padding: "10px" }}>
                                                                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5 text-left">
                                                                        {item.name} 🎂
                                                                    </div>
                                                                </td>
                                                                <td className="text-center" style={{ padding: "10px" }}>
                                                                    {/* {format(new Date(item.dob), "dd MMM, yyyy")} */}
                                                                    {format(new Date(item.dob), "dd/MM/yyyy")}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr className="intro-x">
                                                            <td colSpan={2}>
                                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    No data Found
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>)}
                                </div>
                            </div>
                        </div>

                        <div className="custom-col-12 col-span-6 2xl:col-span-6 sm:col-span-12 xs:col-span-12 text-left p-1 mt-2">
                            {isHRUser() && <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 2xl:col-span-2 mb-2"
                            >
                                <div
                                    style={{
                                        border: "1px solid #e2137b  ",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#e2137b  ",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Attended Time
                                    </h2>
                                    <div className="intro-y p-5" style={{ color: '#e2137b', display: 'flex', justifyContent: "space-between" }}>
                                        {monthwiseLoading ? <>
                                            <Skeleton.Input active={monthwiseLoading} size="small" />
                                        </> : <span className=" text-2xl font-bold text-blue-600"><TimeAgo breakTime={totalFormattedTime} timestamp={punchData?.jobpunchdata?.job_in_time} endTime={punchData?.punchdata[0]?.end_time} /></span>}
                                        <span className=" text-2xl font-bold text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#e2137b" class="bi bi-clock" viewBox="0 0 16 16">
                                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                                        </svg></span>
                                    </div>

                                </div>
                            </div>}
                            <div className="col-span-12 ">

                                <div
                                    style={{
                                        border: "1px solid #24A184",
                                        borderRadius: "5px",
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#24A184",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Monthly Tickets
                                    </h2>

                                    <div className="grid grid-cols-12">
                                        {loadingTic ? (
                                            <div className="col-span-12 sm:col-span-12" >
                                                <div className="flex justify-center mt-5 mb-5">
                                                    <HashLoader
                                                        color="#5755d9"
                                                        size={30}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="col-span-12 sm:col-span-12 p-2" >{getSummaryProductivity()}</div>)}
                                        {/* <div
                                        className="col-span-12 sm:col-span-12 p-2 flex flex-wrap justify-center items-center"
                                    >
                                        <div className="p-5 w-full sm:w-auto text-center" style={{ fontSize: "16px" }}>
                                            <h1 className="mb-2">Working</h1>
                                            <h1 style={{ color: ' rgba(29, 70, 172, 0.6) ' }}>
                                                {loading || !proddata?.working ? (
                                                    <div className="flex justify-center">
                                                        <HashLoader color="#5755d9" size={30} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span style={{ color: "#1D46AC" }}>{proddata.working || "00:00:00"}</span>
                                                        <br />
                                                        <span>hh:mm:ss</span>
                                                    </>
                                                )}
                                            </h1>
                                        </div>
    
                                        <div className="p-5 w-full sm:w-auto text-center" style={{ fontSize: "16px" }}>
                                            <h1 className="mb-2">Productive</h1>
                                            <h1 style={{ color: "#24A184" }}>
                                                {loading || !proddata?.prodtime ? (
                                                    <div className="flex justify-center">
                                                        <HashLoader color="#5755d9" size={30} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span style={{ color: "green" }}>
                                                            {proddata && proddata.prodtime ? proddata.prodtime : "00:00:00"}
                                                        </span>
                                                        <br />
                                                        <span>hh:mm:ss</span>
                                                    </>
                                                )}
                                            </h1>
                                        </div>
    
                                        <div className="p-5 w-full sm:w-auto text-center" style={{ fontSize: "16px" }}>
                                            <h1 className="mb-2">Idle</h1>
                                            <h1 style={{ color: "#FB7474" }}>
                                                {loading || !proddata?.idletime ? (
                                                    <div className="flex justify-center">
                                                        <HashLoader color="#5755d9" size={30} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span style={{ color: "red" }}>
                                                            {proddata && proddata.idletime ? proddata.idletime : "00:00:00"}
                                                        </span>
                                                        <br />
                                                        <span>hh:mm:ss</span>
                                                    </>
                                                )}
                                            </h1>
                                        </div>
                                    </div> */}

                                    </div>
                                </div>

                            </div>

                            <div className="col-span-12 mt-2">
                                <div
                                    style={{
                                        border: "1px solid #1D46AC",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#1D46AC",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Projects
                                    </h2>
                                    {loadingBD ? (
                                        <div className="flex justify-center mt-5 mb-5">
                                            <HashLoader color="#5755d9" size={30} />
                                        </div>
                                    ) : (
                                        <div className="intro-y mt-5 sm:mt-2 p-3">
                                            <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                                                        <tr>
                                                            <th className="whitespace-nowrap p-3">Department</th>
                                                            <th className="whitespace-nowrap p-3">Active</th>
                                                            <th className="whitespace-nowrap p-3">On Hold</th>
                                                            <th className="whitespace-nowrap p-3">In Progress</th>
                                                            <th className="whitespace-nowrap p-3">Completed</th>
                                                            <th className="whitespace-nowrap p-3">Total project</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {projectCount?.map((item, index) => (
                                                            <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                                                                <td className="underlined-grey" style={{ padding: "10px" }}>
                                                                    <Link to={`/manage-project/${item?.department_id}`} >{item?.name}</Link>
                                                                </td>
                                                                <td className="" style={{ padding: "10px" }}>
                                                                    {item?.active_project_count}
                                                                </td>
                                                                <td className="" style={{ padding: "10px" }}>
                                                                    {item?.on_hold_project_count}
                                                                </td>
                                                                <td className="" style={{ padding: "10px" }}>
                                                                    {item?.in_progress_project_count}
                                                                </td>
                                                                <td className="" style={{ padding: "10px" }}>
                                                                    {item?.completed_project_count}
                                                                </td>
                                                                <td className="" style={{ padding: "10px" }}>
                                                                    {item?.total_project_count}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-12 mt-2">
                                <div
                                    style={{
                                        border: "1px solid #d666a5",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#d666a5",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Most Completed Task
                                    </h2>
                                    {loadingBD ? (
                                        <div className="flex justify-center mt-5 mb-5">
                                            <HashLoader color="#5755d9" size={30} />
                                        </div>
                                    ) : (
                                        <div className="intro-y mt-5 sm:mt-2 p-3">
                                            <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                                                        <tr>
                                                            <th className="whitespace-nowrap p-3">Name</th>
                                                            <th className="whitespace-nowrap p-3">Completed Task</th>
                                                            <th className="whitespace-nowrap p-3">Completed Sub Task</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {taskCount?.map((item, index) => (
                                                            <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                                                                <td className="underlined-grey" style={{ padding: "10px" }}>
                                                                    <Link to={`/task/${item?.uuid}`} >{item?.name}</Link>
                                                                </td>
                                                                <td className="" style={{ padding: "10px" }}>
                                                                    {item?.completed_tasks}
                                                                </td>
                                                                <td className="" style={{ padding: "10px" }}>
                                                                    {item?.completed_subtasks}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-12  mt-2">
                                <div
                                    style={{
                                        border: "1px solid #3879F3",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#3879F3",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Holiday
                                    </h2>
                                    {loadingHD ? (
                                        <div className="flex justify-center mt-5 mb-5">
                                            <HashLoader
                                                color="#5755d9"
                                                size={30}
                                            />
                                        </div>
                                    ) : (<div className="intro-y mt-5 sm:mt-2 p-3">
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead style={{ backgroundColor: "#f8f9fa" }}>
                                                <tr>
                                                    <th className="whitespace-nowrap p-3">Name</th>
                                                    <th className="text-center whitespace-nowrap p-3">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {holidaydata && holidaydata.length > 0 ? (
                                                    holidaydata.map((item, i) => (
                                                        <tr key={i}>
                                                            <td className="p-3" style={{ padding: "10px" }}>
                                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5 text-left">
                                                                    {item.name}
                                                                </div>
                                                            </td>
                                                            <td className="text-center" style={{ padding: "10px" }}>
                                                                {/* {format(new Date(item.dob), "dd MMM, yyyy")} */}
                                                                {format(new Date(item.date), "dd/MM/yyyy")}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr className="intro-x">
                                                        <td colSpan={2}>
                                                            <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                No data Found
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>)}

                                </div>
                                <div className="col-span-12 mt-2">
                                    <div style={{ border: "1px solid #E34444", borderRadius: "5px" }}>
                                        <h2 style={{
                                            background: "#E34444",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <span>Pending Profile Documents</span>
                                        </h2>
                                        {loadingPP ? (
                                            <div className="flex justify-center mt-5 mb-5">
                                                <HashLoader color="#5755d9" size={30} />
                                            </div>
                                        ) : (
                                            <div className="intro-y mt-2 p-3">
                                                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                        <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="whitespace-nowrap p-3" style={{ textAlign: "left" }}>Employee Name</th>
                                                                <th className="whitespace-nowrap p-3" style={{ textAlign: "center" }}>Pending Count</th>
                                                                <th className="whitespace-nowrap p-3" style={{ textAlign: "center" }}>Details</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {pendingProfileData && pendingProfileData.length > 0 ? (
                                                                pendingProfileData.map((item, i) => (
                                                                    <>
                                                                        <tr key={item.uuid} style={{ borderBottom: "1px solid #f0f0f0", background: expandedUser === item.uuid ? "#fff5f5" : "white" }}>
                                                                            <td style={{ padding: "10px" }}>
                                                                                <div style={{ fontWeight: 500, fontSize: "13px", color: "#333" }}>
                                                                                    {item.name}
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ padding: "10px", textAlign: "center" }}>
                                                                                <span style={{
                                                                                    background: item.pending_fields.length > 5 ? "#ffe0e0" : "#fff3e0",
                                                                                    color: item.pending_fields.length > 5 ? "#E34444" : "#FC9A30",
                                                                                    borderRadius: "12px",
                                                                                    padding: "2px 10px",
                                                                                    fontWeight: 700,
                                                                                    fontSize: "12px"
                                                                                }}>
                                                                                    {item.pending_fields.length}
                                                                                </span>
                                                                            </td>
                                                                            <td style={{ padding: "10px", textAlign: "center" }}>
                                                                                <button
                                                                                    onClick={() => setExpandedUser(expandedUser === item.uuid ? null : item.uuid)}
                                                                                    style={{
                                                                                        background: expandedUser === item.uuid ? "#E34444" : "#f0f0f0",
                                                                                        color: expandedUser === item.uuid ? "#fff" : "#555",
                                                                                        border: "none",
                                                                                        borderRadius: "5px",
                                                                                        padding: "4px 12px",
                                                                                        cursor: "pointer",
                                                                                        fontSize: "12px",
                                                                                        fontWeight: 500,
                                                                                        transition: "all 0.2s"
                                                                                    }}
                                                                                >
                                                                                    {expandedUser === item.uuid ? "Hide" : "View"}
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                        {expandedUser === item.uuid && (
                                                                            <tr key={`${item.uuid}-detail`} style={{ background: "#fff5f5" }}>
                                                                                <td colSpan={3} style={{ padding: "10px 16px 14px 16px" }}>
                                                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                                                        {item.pending_fields.map((field, fi) => (
                                                                                            <span key={fi} style={{
                                                                                                background: "#ffe0e0",
                                                                                                color: "#c0392b",
                                                                                                border: "1px solid #f5c6c6",
                                                                                                borderRadius: "5px",
                                                                                                padding: "3px 10px",
                                                                                                fontSize: "11px",
                                                                                                fontWeight: 500
                                                                                            }}>
                                                                                                {field.replace(/_/g, " ")}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={3}>
                                                                        <div className="text-slate-500 text-xs text-center p-4">
                                                                            All employee profiles are complete
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-span-12 mt-2">
                            <div
                                style={{
                                    border: "1px solid #47525D",
                                    borderRadius: "5px",
                                }}
                            >
                                <h2
                                    style={{
                                        background: "#47525D",
                                        borderRadius: "2px",
                                        fontSize: "15px",
                                        padding: "10px",
                                        fontWeight: 500,
                                        color: "#fff",
                                        textAlign: "start",
                                    }}
                                >
                                    Announcement
                                </h2>
                                {loadingBD ? (
                                    <div className="flex justify-center mt-5 mb-5">
                                        <HashLoader color="#5755d9" size={30} />
                                    </div>
                                ) : (
                                    <div className="intro-y mt-5 sm:mt-2 p-3">
                                        <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                                                    <tr>
                                                        <th className="whitespace-nowrap p-3">Department</th>
                                                        <th className="whitespace-nowrap p-3">Total project</th>
                                                        <th className="whitespace-nowrap p-3">Active</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {projectCount?.map((item, index) => (
                                                        <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                                                            <td className="" style={{ padding: "10px" }}>
                                                                {item?.name}
                                                            </td>
                                                            <td className="" style={{ padding: "10px" }}>
                                                                {item?.project_count}
                                                            </td>
                                                            <td className="" style={{ padding: "10px" }}>
                                                                {item?.active_project_count}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div> */}
                            {/* <div className="col-span-12 mt-2">
                            <div
                                style={{
                                    border: "1px solid #F97B6A",
                                    borderRadius: "5px",
                                }}
                            >
                                <h2
                                    style={{
                                        background: "#F97B6A",
                                        borderRadius: "2px",
                                        fontSize: "15px",
                                        padding: "10px",
                                        fontWeight: 500,
                                        color: "#fff",
                                        textAlign: "start",
                                    }}
                                >
                                    Late Arrived Details
                                </h2>
                                {loadingDA ? (
                                    <div className="flex justify-center mt-5 mb-5">
                                        <HashLoader
                                            color="#5755d9"
                                            size={30}
                                        />
                                    </div>
                                ) : (
                                    <div className="intro-y mt-5 sm:mt-2 p-3">
                                        {attdata?.latearrivedUsers?.length > 0 ? (
                                            <div
                                                style={{
                                                    maxHeight: attdata.latearrivedUsers.length > 10 ? "400px" : "auto",
                                                    overflowY: attdata.latearrivedUsers.length > 10 ? "auto" : "visible",
                                                    overflowX: "auto"
                                                }}
                                            >
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                                                        <tr>
                                                            <th className="p-3" style={{ padding: "10px", textAlign: "left" }}>EMP Name</th>
                                                            <th className="p-3" style={{ padding: "10px", textAlign: "left" }}>Punch Time</th>
                                                            <th className="p-3" style={{ padding: "10px", textAlign: "left" }}>Late Arrived</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {attdata?.latearrivedUsers?.map((item, index, array) => (
                                                            <tr key={index} style={{
                                                                borderBottom: index === array.length - 1 ? "none" : "1px solid #ccc",
                                                                color: item?.maxStartTimeLate && "#E34444",
                                                                fontWeight: item?.maxStartTimeLate && "600",
    
                                                            }}>
                                                                <td style={{ padding: "10px" }}>
                                                                    {item?.name}
                                                                </td>
                                                                <td style={{ padding: "10px" }}>
                                                                    {item?.start_time}
                                                                </td>
                                                                <td style={{ padding: "10px" }}>
                                                                    {item?.late_minutes}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">Everyone was punctual today.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-12 mt-2">
                            <div
                                style={{
                                    border: "1px solid #E34444",
                                    borderRadius: "5px",
                                }}
                            >
                                <h2
                                    style={{
                                        background: "#E34444",
                                        borderRadius: "2px",
                                        fontSize: "15px",
                                        padding: "10px",
                                        fontWeight: 500,
                                        color: "#fff",
                                        textAlign: "start",
                                    }}
                                >
                                    Absent
                                </h2>
                                {loadingAE ? (
                                    <div className="flex justify-center mt-5 mb-5">
                                        <HashLoader
                                            color="#5755d9"
                                            size={30}
                                        />
                                    </div>
                                ) : (
                                    <div className="intro-y mt-5 sm:mt-2 p-3">
                                        <div
                                            style={{
                                                maxHeight: absentDataView && absentDataView.length > 10 ? "400px" : "auto",
                                                overflowY: absentDataView && absentDataView.length > 10 ? "auto" : "visible",
                                                overflowX: "auto"
                                            }}
                                        >
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                                                    <tr>
                                                        <th className="text-start whitespace-nowrap p-3">Username</th>
                                                        <th className="whitespace-nowrap p-3">Employee Name</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {absentDataView && absentDataView.length > 0 ? (
                                                        absentDataView.map((item, i) => (
                                                            <tr key={i} style={{
                                                                borderBottom: i === absentDataView.length - 1 ? "none" : "1px solid #ccc",
                                                            }}>
                                                                <td className="p-3" style={{ padding: "10px" }}>
                                                                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5 text-left">
                                                                        {item?.username}
                                                                    </div>
                                                                </td>
                                                                <td className="text-start" style={{ padding: "10px" }}>
                                                                    {item.name}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr className="intro-x">
                                                            <td colSpan={2}>
                                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    No data Found
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div> */}

                            {/* <div className="col-span-12  mt-2">
                            <div
                                style={{
                                    border: "1px solid #53A8CB",
                                    borderRadius: "5px",
                                }}
                            >
                                <h2
                                    style={{
                                        background: "#53A8CB",
                                        borderRadius: "2px",
                                        fontSize: "15px",
                                        padding: "10px",
                                        fontWeight: 500,
                                        color: "#fff",
                                        textAlign: "start",
                                    }}
                                >
                                    Tickets
                                </h2>
                                {loadingTic ? (
                                    <div className="flex justify-center mt-5 mb-5">
                                        <HashLoader
                                            color="#5755d9"
                                            size={30}
                                        />
                                    </div>
                                ) : (
                                    <div className="intro-y">
                                        {getSummaryTicket()}
                                    </div>)}
                            </div>
                        </div> */}
                            {/* <div className="col-span-12  mt-2">
                            <div
                                style={{
                                    border: "1px solid #3879F3",
                                    borderRadius: "5px",
                                }}
                            >
                                <h2
                                    style={{
                                        background: "#3879F3",
                                        borderRadius: "2px",
                                        fontSize: "15px",
                                        padding: "10px",
                                        fontWeight: 500,
                                        color: "#fff",
                                        textAlign: "start",
                                    }}
                                >
                                    Timesheet
                                </h2>
                                {loadingTC ? (
                                    <div className="flex justify-center mt-5 mb-5">
                                        <HashLoader
                                            color="#5755d9"
                                            size={30}
                                        />
                                    </div>
                                ) : (<div className="intro-y p-5">
                                    <div className="text-white font-semibold p-2 rounded-lg" style={{ backgroundColor: '#24A184', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Total Update Timesheet Emp</span>
                                        <span className="text-lg">{timesheetCount?.withEntry || 0}</span>
                                    </div>
                                    <div className="text-white font-semibold p-2 mt-3 rounded-lg" style={{ backgroundColor: '#FB7474', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Not Update Timesheet Emp</span>
                                        <span className="text-lg">{timesheetCount?.withoutEntry || 0}</span>
                                    </div>
                                </div>)}
                            </div>
                        </div> */}

                        </div>

                        {/* {(isManagerUser() || isHRUser() || isAdminUser()) &&
                            <div className="col-span-12  mt-2">
                                <div
                                    style={{
                                        border: "1px solid #4A657A",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            background: "#4A657A",
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            padding: "10px",
                                            fontWeight: 500,
                                            color: "#fff",
                                            textAlign: "start",
                                        }}
                                    >
                                        Job Application
                                    </h2>
                                    <div className="p-3">
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between"
                                        }}>
                                            <div style={{
                                                borderRadius: "5px",
                                                overflow: "hidden",
                                                backgroundColor: "#f8f9fa"
                                            }}>

                                                <button className={activeBtn === 'D' ? "job-application-fliter-button job-application-fliter-button-active" : "job-application-fliter-button"}
                                                    style={{
                                                        borderRight: "1px solid gray"
                                                    }}
                                                    onClick={() => { setActiveBtn("D") }}>D</button>

                                                <button className={activeBtn === 'W' ? "job-application-fliter-button job-application-fliter-button-active" : "job-application-fliter-button"}
                                                    style={{
                                                        borderRight: "1px solid gray"
                                                    }}
                                                    onClick={() => { setActiveBtn("W") }}>W</button>

                                                <button className={activeBtn === 'Q' ? "job-application-fliter-button job-application-fliter-button-active" : "job-application-fliter-button"}
                                                    style={{
                                                        borderRight: "1px solid gray"
                                                    }}
                                                    onClick={() => { setActiveBtn("Q") }}>F</button>

                                                <button className={activeBtn === 'M' ? "job-application-fliter-button job-application-fliter-button-active" : "job-application-fliter-button"}
                                                    onClick={() => { setActiveBtn("M") }}>M</button>

                                            </div>
                                            <div className="px-2 py-2 rounded text-white" style={{
                                                background: "#FC9A30",
                                            }}>
                                                Total - {TotalApplicationCount}
                                            </div>
                                        </div>
                                        <div style={{
                                            width: "100%",
                                            maxHeight: "500px",
                                            overflowY: "auto",
                                            overflowX: "hidden" // Prevent horizontal scrolling
                                        }}>
                                            <table style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                tableLayout: "fixed" // Ensure columns maintain proper width
                                            }} className="mt-2">
                                                <thead style={{
                                                    backgroundColor: "#f8f9fa",
                                                    position: "sticky",
                                                    top: 0,
                                                    zIndex: 1
                                                }}>
                                                    <tr>
                                                        <th style={{ padding: "10px", textAlign: 'left' }}>Job Title</th>
                                                        <th style={{ padding: "10px", width: "8%" }}>No of #</th>
                                                        <th style={{ padding: "10px", width: "12%" }}>Personality Test</th>
                                                        <th style={{ padding: "10px", width: "12%" }}>Assesment Test</th>
                                                        <th style={{ padding: "10px", width: "12%" }}>Prectical Test</th>
                                                        <th style={{ padding: "10px", width: "10%" }}>Technical</th>
                                                        <th style={{ padding: "10px", width: "7%" }}>Final</th>
                                                        <th style={{ padding: "10px", width: "10%" }}>HR Round</th>
                                                    </tr>
                                                </thead>
                                                {loadingJA ? (
                                                    <div className="flex justify-center mt-5 mb-5">
                                                        <HashLoader
                                                            color="#5755d9"
                                                            size={30}
                                                        />
                                                    </div>
                                                ) : (
                                                    <tbody>
                                                        {jobApplicationCount?.data?.map((item, i) => (
                                                            <tr key={i} style={{ borderBottom: "1px solid #ccc" }}>
                                                                <td className="underlined-grey" style={{ padding: "10px", textAlign: 'left' }}>
                                                                    <a
                                                                        href={`/job-applications-new/${startDateSelected}/${endDate}/${item?.position_uuid}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {item?.name}
                                                                    </a>
                                                                </td>
                                                                <td style={{ padding: "10px" }}>{item?.noofapp}</td>
                                                                <td style={{ padding: "10px" }}>{item?.personality_com_count}</td>
                                                                <td style={{ padding: "10px" }}>{item?.ass_com_count}</td>
                                                                <td style={{ padding: "10px" }}>{item?.practical_com_count}</td>
                                                                <td style={{ padding: "10px" }}>{item?.tech_com_count}</td>
                                                                <td style={{ padding: "10px" }}>{item?.final_com_count}</td>
                                                                <td style={{ padding: "10px" }}>{item?.hired_com_count}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                )}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>} */}
                    </div >


                    {/* <div style={{ marginTop: "200px" }} className="flex items-center sm:ml-auto mt-5 pt-5 sm:mt-0">
                    <DatePicker
                        clearIcon=""
                        calendarIcon={
                            <FaCalendar
                                style={{
                                    color: "rgb(30 64 175)",
                                }}
                            />
                        }
                        onChange={handledate}
                        value={date}
                    />
    
                </div> */}

                </>
            )}
            {activeTab === "tab2" && (
                <HrJob />
            )}
        </>
    );
};
export default Home;

console.log("new feature");
console.log("new feature 1");
console.log("new feature 2");
//adding cooment here also
