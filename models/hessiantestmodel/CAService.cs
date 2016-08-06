using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography.X509Certificates;

/// <summary>
/// Summary description for CAService
/// </summary>
public interface CAService
{
    String RequestCertificate(String[] subjInfo, PublicKey pubkey);
    String RenewCertificate(String[] subjInfo, PublicKey pubkey, DateTime endDate, int duration);
    int revoke(String[] certSerialNo, int myRevocationReason);

    //SSL Certificate
    //String RequestCertificateJson(String JSONString, String base64Pubkey, String certProcedure);
    //String RenewCertificateJson(String JSONString, String base64Pubkey, String endDate, String certProcedure);
    //String RenewCertificateJson(String JSONString, String base64Pubkey, DateTime endDate, String certProcedure);

    String RequestCertificate2(String[] subjInfo, PublicKey pubkey, String certProcedure);

    String RenewCertificate2(String[] subjInfo, PublicKey pubkey, DateTime endDate, String certProcedure);

    String RequestCertificateJson(String JSONString, String base64Pubkey, String certProcedure);

    String RenewCertificateJson(String JSONString, String base64Pubkey, String endDate, String certProcedure);

    String RenewCertificateJson(String JSONString, String base64Pubkey, DateTime endDate, String certProcedure);

    String RequestCertificateCSR(String base64CSR, String certProcedure);

    String RenewCertificateCSR(String base64CSR, String endDate, String certProcedure);

}
