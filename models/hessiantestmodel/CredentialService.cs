using System;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// Summary description for CredentialService
/// </summary>
public interface CredentialService
{
     ArrayList getRegistrationQuestion(int noOfQuestions, String lang);
     int signData(String userId, Dictionary<string, string> challengeResponse, byte[] responseSignature, String PIN);
	
}
