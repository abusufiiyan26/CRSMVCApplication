using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;

/// <summary>
/// Summary description for HessianFactory
/// </summary>
public interface RoamingService
{

    String testConnection(String url) ;
	//int GenRoamingID(String user_id, String org_id, String subjectDN, String PIN, String email) ;  
	String RenewCert(String user_id, String org_id) ; 
	int RevokeCert(String id,String orgId,String email,String contactNo) ;

    //Find the serial number
	List<X509Certificate> findCert(String userId,String orgId) ; 
	String loadKeyStore(String userId, String orgId) ;
	
	List<String> findResetEmailList() ;
	int ChangePIN(String user_id, String old_pin, String new_pin ) ;
    //2 blocked 3 wrong pin 4 pin incorrect 5 user not exist
	String updateEmailStatus(String id) ;
	int VerifyPIN(String user_id,String oin) ;
    //0:takde ; 1:ada , 2:block , 5:user not exist ,6:revoke
	int isPINConfigured(String user_id) ;
	int RequestChangePIN(String user_id, String email);
	List<String> findChangePinEmailList() ;
	String updateEmailChangePin(String userId) ;
    Boolean VerifyActivationCode(String user_id, String opin);

    int RequestResetPIN(String user_id, String email);

    int ResetPIN(String user_id, String old_pin, String new_pin);
    //cdc purposes
    //int ResetPIN(String user_id, String email);

    int revoke(String[] certSerialNo, int myRevocationReason, String user_id, String org_id, String projID);
    Boolean isRevoke(String user_id, String org_id);

    //Generate New Soft Certificate
    String GenRoamingSufi(String[] subjInfo, String PIN, String certProcedure);

    //Generate Renewal Roaming Certificate
    int RenewRoamingIDPCP(String user_id, String org_id, String subjectDN, String PIN, String email, String projectID, String certProcedure);

    //Generate New Roaming Certificate w Start Date
    int GenRoamingIDPCPwithStartDate(String user_id, String org_id, String subjectDN, String PIN, String email, String startDate, String projectID, String certProcedure);

    String GenSoftCertJson(String JSONString, String PIN, String startDate, String certProcedure);
    int GenRoamingJson(String JSONString, String PIN, String certProcedur, String projectID);
}
