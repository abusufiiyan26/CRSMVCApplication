using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography.X509Certificates;

/// <summary>
/// Summary description for Enrollmentt
/// </summary>
public interface EnrollmentService
{
	//int initRoamingId(String userId, String orgId, String subjectDN,String PIN,String email,Int32 Duration);
	System.Collections.ArrayList findCert(String userId,String orgId);  
	//int requestCertificate(String fullname, String userid, String orgid, String email, ReqInfo vo, String requestid);
	//int requestRenew(String fullname, String userid, String orgid, String email, ReqInfo vo);
    int requestRevoke(String fullname, String userid, String orgid, String email, String requestid); 
    int checkUserStatus(String user_id,String auth_code);
    Boolean VerifyActivationCode(String user_id, String activation_code);

    int initRoamingIdP(String userId, String orgId, String subjectDN, String PIN, String email, Int32 Duration, String projectID);
}
