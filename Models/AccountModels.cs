using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Web.Security;

namespace OneCRS.MVC.Models
{
    public class UsersContext : DbContext
    {
        public UsersContext()
            : base("DefaultConnection")
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
    }

    [Table("UserProfile")]
    public class UserProfile
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        public string UserName { get; set; }
    }

    public class RegisterExternalLoginModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        public string ExternalLoginData { get; set; }
    }

    public class LocalPasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginModel
    {
        [Required]
        [Display(Name = "Username")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }

        public string SecurityImg { get; set; }
        public string SecurityPhrase { get; set; }
        public string ErrorMessage { get; set; }
        public string Status { get; set; }

        [System.Web.Mvc.HiddenInput(DisplayValue = false)]
        public string ReturnUrl { get; set; }
        public string OpenModal { get; set; }
    }

    public class InternalLogin
    {
        public string InternalUserID { get; set; }
        public int SecurityQuestion { get; set; }
        public string InternalPin { get; set; }

        public string ProjectID { get; set; }
        public string ReturnUrl { get; set; }
    }

    public class RegisterModel
    {
        [Required(ErrorMessage = "Required")]
        [Display(Name = "Username")]
        [RegularExpression("^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$", ErrorMessage = "Username required a character and also numbers")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Required")]
        [StringLength(12, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [RegularExpression("^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$", ErrorMessage = "Password required a character and also numbers")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Required")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "ID Type")]
        public string IDType { get; set; }

        [Display(Name = "IC No")]
        public string ICNo { get; set; }

        [Display(Name = "Passport")]
        public string Passport { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Date of Birth")]
        public string DOB { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Gender")]
        public string Sex { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Address")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "City")]
        public string City { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "State")]
        public int State { get; set; }

        [Required(ErrorMessage = "Required")]
        [RegularExpression("([0-9][0-9]*)", ErrorMessage = "Enter only numeric number")]
        [Display(Name = "Postcode")]
        public string Postcode { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Country")]
        public int Country { get; set; }

        [Required(ErrorMessage = "Required")]
        [Range(0, int.MaxValue, ErrorMessage = "Please enter valid Number")]
        [Display(Name = "Mobile No")]
        public string Mobile_No { get; set; }

        [Required(ErrorMessage = "Required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Security Image")]
        public string SecurityImg { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Security Phrase")]
        public string SecurityPhrase { get; set; }
    }

    public class AdminLoginModel
    {
        public string adminuserid { get; set; }
        public string adminpassword { get; set; }
    }

    public class ResetAdminModel
    {
        public string ICNo { get; set; }
        public string Email { get; set; }
    }

    //Added on 17 nov 2015 by abu
    public class ForgetPasswordModel
    {
        [Display(Name = "Username")]
        public string UserName { get; set; }

    }

    //Added on 17 nov 2015 by abu
    public class ResetPasswordModel
    {

        [Required]
        [StringLength(12, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ForgetUsernameModel
    {
        [Required]
        public string ICNo { get; set; }
        public string SecurityImg { get; set; }
        public string Email { get; set; }
    }

    public class ResetUsernameModel
    {
        [Required]
        [Display(Name = "New Username")]
        public string NewUsername { get; set; }

        [Required]
        [StringLength(12, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ExternalLogin
    {
        public string Provider { get; set; }
        public string ProviderDisplayName { get; set; }
        public string ProviderUserId { get; set; }
    }
}
