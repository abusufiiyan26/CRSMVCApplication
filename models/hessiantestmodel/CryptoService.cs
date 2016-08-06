using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public interface CryptoService
{
	byte[] signTransaction(string userId, string orgId, byte[] data,string PIN);
	int validateSignText(byte[] origText, byte[] signText);
	int testConnection() ;
}
