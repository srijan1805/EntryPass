//Google and Microsoft API url
export const GoogleURL =
  "https://accounts.google.com/o/oauth2/v2/auth?client_id=640589102255-13vqaq7gn778f1bq1od2q8rg3ntqf0f4.apps.googleusercontent.com&redirect_uri=https://entrypass-dotnet-dev.azurewebsites.net/Test/Hello&response_type=code&scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&access_type=offline&state=12345";
export const MicrosoftURL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=039f313e-895f-4be5-bf93-492211fb0d79&response_type=code&response_mode=form_post&redirect_uri=entrypass://entry/0&scope=openid%20offline_access%20profile%20https%3A%2F%2Fgraph.microsoft.com%2F.default&state=12345";

// Google and microsoft auth url
export const GooglelocalURL = "auth/google";
export const MicrosoftlocalURL = "auth/microsoft";
export const ApplelocalURL = "auth/apple";

//Address History URL

export const employeeRoute = "Employee/";
export const addressHistoryListing = "Address/History/";
export const addressHistoryDetails = "Address/";
export const AddressHistoryURL = "Employee/{emplId}/Address/History";
export const AddressVerificationSubmit = "Address";
export const Addressresident = "Address/ResidenceTypes";

//Login APIs-----
export const VerifyOTPURL = "Login/VerifyOtp";

export const VerifyOTPtigger = "Otp/trigger";
export const VerifyOTPValidate = "Otp/validate";
export const ResendOTP = "Otp/resend";

export const LoginQRcodeIdURL = "Login/QRCode";
export const LoginIDUrl = "Login/Employee";
export const EmployeeVerify = "verify";

//Scan QR APIs-----
export const FacilityScan = "Facility";
export const SupervisiorScan = "Supervisor";
export const AttendanceScan = "Attendance";
export const Emptimeid = "emptimeid";

//Address ImageUpload
export const UploadImage = "Address/Upload?imgType=";
export const DownloadImage = "Address/Download?fileName=";

// Notifications API
export const Notifications = "Notifications";
export const EmployeeeNotifications = "Employeee";

export const AttendanceStaffALL = "/Attendance/All?date=";
export const AttendanceCalendarList = "/Attendance/List";
export const AttendanceReason = "/Attendance/Reasons";
export const AttendanceReasonSubmit = "/Attendance/Request";

export const Logout = "Logout";

//ART API
export const ArtQrCodeScan = "QrCode/";
export const ArtTestID = "EmployeeNo/";
export const ArtTestSubmitDet = "ArtTest";
export const ArtTestKit = "/TestKit";
export const QRCode = "QRCode/";

//Notification

export const attendancePush = "Attandance/Push";
export const deviceRegistration = "DeviceRegistration";
export const Notiftypes = "Notiftypes";
export const Enable = "Enable";

//gps attendance

export const ClockinGps = "ClockInGps";
export const ClockoutGps = "ClockOutGps";

//Acknowledge
export const ClockinAck = "ClockInAck";
export const ClockoutAck = "ClockOutAck";

//delete profile
export const DeleteProfile = "DeleteProfile";

//upload profile image

export const ProfileImage = "ProfileImage";

//reporting staff
export const StaffUnderSupervisior = "StaffUnderSupervisor";
export const RemoveStaffUnderSupervisor = "RemoveStaffUnderSupervisor";

//active staff
export const ActiveStaff = "StaffActive";
