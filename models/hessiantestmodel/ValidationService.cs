using System;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// Summary description for HessianFactory
/// </summary>
public interface ValidationService
{
    /*
        int OPERATION_VS_FAILED 	= 0;
	    int OPERATION_VS_SUCCESSFUL = 1;
    	
	    int ERROR_VS_USER_EXISTED 	= 10;
	    int ERROR_VS_USER_NOT_FOUND = 11;
	    int ERROR_VS_USER_INVALID 	= 12;
	    int ERROR_VS_USER_REVOKED 	= 13;
	    int ERROR_VS_USER_SUSPENDED = 14;
	    int ERROR_VS_USER_INACTIVE 	= 15;
	    int ERROR_VS_USER_CHALLENGE_RESET = 16;
	    int ERROR_VS_USER_CHALLENGE_NOTCONFIGURED = 17;
	    int ERROR_VS_INVALID_EMAIL = 18;
    	
	    int ERROR_VS_WS_CONNECTION 	= 20;
	    int ERROR_VS_DB_CONNECTION 	= 21;
    	
	    int ERROR_VS_TRANSACTION 	= 30;
	    int ERROR_VS_IO 			= 31;
	    int ERROR_VS_SQL 			= 32;	
	    int ERROR_VS_INVALID_RESPONSE = 40;
    */

    int initRoamingCredential(String userId, String orgId, Dictionary<string, string> challengeResponse);
    ArrayList getRandomQuestion(String userId, int noOfQuestions);
	int resetChallenge(String userId);
    int verifyUser(String userId, Dictionary<string, string> challengeResponse);

    //used for internal user
    int verifyUserInternal(String userId, Dictionary<string, string> challengeResponse);
	int isChallengeConfigured(String userId);
	int generateCRUpdateAuthCode(String userId, String email);
    int testConnection();
	//Boolean verifySQA(String userId, Credential credential);

    /*
	public int initRoamingCredential(String userId, String orgId, HashMap<String, String> challengeResponse);
	public List<String> getRandomQuestion(String userId, int noOfQuestions);
	public int resetChallenge(String userId);
	public int verifyUser(String userId, HashMap<String, String> challengeResponse);
	int isChallengeConfigured(String userId);
	int generateCRUpdateAuthCode(String userId, String email);
	int testConnection() throws RemoteException;
	public boolean verifySQA(String userId, Credential credential);
     */

}

