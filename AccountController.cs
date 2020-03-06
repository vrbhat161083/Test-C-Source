using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;
using CerereNSN.Filters;
using CerereNSN.Models;

namespace CerereNSN.Controllers
{
    //[Authorize]
    //[InitializeSimpleMembership]
    public class AccountController : Controller
    {
        //
        // GET: /Account/Login
        CerereNSNEntities ent = new CerereNSNEntities();
        //[AllowAnonymous]
        public class userData
        {
            public int grad { get; set; }
            public string nume { get; set; }
            public string prenume { get; set; }
            public string idUtil { get; set; }
            public string telefon { get; set; }
            public int idsu { get; set; }
            public int adminbnc { get; set; }
            public int adminbncbr { get; set; }
            public string nom { get; set; }
            public int adminnom { get; set; }
            public int adminnombr { get; set; }
            public int respsu { get; set; }
            public string idclasasu { get; set; }
            public string idbrsu { get; set; }
            public int coordsu { get; set; }
            public int coordsubr { get; set; }
            public int respbnc { get; set; }
            public int respbncbr { get; set; }
            public int codifnsnid { get; set; }
            public int codifnsn { get; set; }
            public int codifncage { get; set; }
            public int codifncagebr { get; set; }
            public int sefsecid { get; set; }
            public int sefsec { get; set; }
            public int coordbnc { get; set; }
            public int idUser { get; set; }
        }
        public ActionResult tabel_utilizatori(string grad="-1", string nume="-1", string su="-1", string cod="-1", string clasa="-1", string bca="-1", string rol="-1")
        {
            List<vw_utilizatori> list = ent.vw_utilizatori.ToList();
            if (grad != "-1" || nume != "-1" || su != "-1" || cod != "-1" || clasa != "-1" || bca != "-1" || rol != "-1" )
                list = ent.filtru_utilizatori(grad, nume, su, cod, clasa, bca, rol).ToList();
            return PartialView(list);
        }
        public JsonResult get_dataUtil(int id)
        {
            var user = ent.utilizatori.FirstOrDefault(p => p.id == id);
            return Json(user);
        }
        public ActionResult saveutil(userData utilizator)
        {
            if (utilizator.idUser == -1)
            {
                using (ent = new CerereNSNEntities())
                {
                    try
                    {
                        var valid = ent.utilizatori.FirstOrDefault(p => p.nume_utilizator == utilizator.idUtil);
                        if (valid != null)
                        {
                            return Json("User existent!");
                        }

                        ent.save_user(utilizator.grad, utilizator.nume, utilizator.prenume, utilizator.idUtil, HashPassword("abcd12!@"), utilizator.telefon, utilizator.idsu, true);
                        int idUser = ent.utilizatori.FirstOrDefault(x => x.nume_utilizator == utilizator.idUtil).id;
                        if (utilizator.adminbnc != -1)
                        {
                            ent.save_user_in_role(idUser, utilizator.adminbnc, Convert.ToBoolean(utilizator.adminbncbr), null, null, utilizator.nom);
                        }

                        if (utilizator.adminnom != -1)
                        {
                            if (utilizator.adminbnc == -1)
                                ent.save_user_in_role(idUser, utilizator.adminnom, Convert.ToBoolean(utilizator.adminnombr), null, null, utilizator.nom);
                            else
                                ent.save_user_in_role(idUser, utilizator.adminnom, Convert.ToBoolean(utilizator.adminnombr), null, null, null);
                        }
                        if (utilizator.coordsu != -1)
                        {
                            ent.save_user_in_role(idUser, utilizator.coordsu, Convert.ToBoolean(utilizator.coordsubr), null, null, null);
                        }
                        if (utilizator.respbnc != -1)
                        {
                            ent.save_user_in_role(idUser, utilizator.respbnc, Convert.ToBoolean(utilizator.respbncbr), null, null, null);
                        }
                        if (utilizator.codifncage != -1)
                        {
                            ent.save_user_in_role(idUser, utilizator.codifncage, Convert.ToBoolean(utilizator.codifncagebr), null, null, null);
                        }
                        if (utilizator.coordbnc != -1)
                        {
                            ent.save_user_in_role(idUser, utilizator.coordbnc, null, null, null, null);
                        }
                        if (utilizator.codifnsnid != -1)
                        {
                            ent.save_user_in_role(idUser, utilizator.codifnsnid, null, null, utilizator.codifnsn, null);
                        }
                        if (utilizator.sefsecid != -1)
                        {
                            ent.save_user_in_role(idUser, utilizator.sefsecid, null, null, utilizator.sefsec, null);
                        }
                        if (utilizator.respsu != -1)
                        {
                            string[] idclasa = utilizator.idclasasu.Split(',');
                            string[] br = utilizator.idbrsu.Split(',');
                            for (int i = 0; i < idclasa.Length; i++)
                            {
                                ent.save_user_in_role(idUser, utilizator.respsu, Convert.ToBoolean(Convert.ToInt32(br[i])), Convert.ToInt32(idclasa[i]), null, null);
                            }

                        }
                    }

                    catch (Exception)
                    {

                    }
                }
            }
            else
            {
                 var valid = ent.utilizatori.FirstOrDefault(p => p.nume_utilizator == utilizator.idUtil && p.id!=utilizator.idUser);
                        if (valid != null)
                        {
                            return Json("User existent!");
                        }
                var user = ent.utilizatori.FirstOrDefault(p => p.id == utilizator.idUser);
                user.id_grad = utilizator.grad;
                user.nume = utilizator.nume;
                user.prenume = utilizator.prenume;
                user.nume_utilizator = utilizator.idUtil;
                user.telefon = utilizator.telefon;
                user.id_su = utilizator.idsu;
                ent.SaveChanges();
                ent.sterge_user_in_roles(utilizator.idUser);
                /////////////////
                if (utilizator.adminbnc != -1)
                {
                    ent.save_user_in_role(utilizator.idUser, utilizator.adminbnc, Convert.ToBoolean(utilizator.adminbncbr), null, null, utilizator.nom);
                }

                if (utilizator.adminnom != -1)
                {
                    if (utilizator.adminbnc == -1)
                        ent.save_user_in_role(utilizator.idUser, utilizator.adminnom, Convert.ToBoolean(utilizator.adminnombr), null, null, utilizator.nom);
                    else
                        ent.save_user_in_role(utilizator.idUser, utilizator.adminnom, Convert.ToBoolean(utilizator.adminnombr), null, null, null);
                }
                if (utilizator.coordsu != -1)
                {
                    ent.save_user_in_role(utilizator.idUser, utilizator.coordsu, Convert.ToBoolean(utilizator.coordsubr), null, null, null);
                }
                if (utilizator.respbnc != -1)
                {
                    ent.save_user_in_role(utilizator.idUser, utilizator.respbnc, Convert.ToBoolean(utilizator.respbncbr), null, null, null);
                }
                if (utilizator.codifncage != -1)
                {
                    ent.save_user_in_role(utilizator.idUser, utilizator.codifncage, Convert.ToBoolean(utilizator.codifncagebr), null, null, null);
                }
                if (utilizator.coordbnc != -1)
                {
                    ent.save_user_in_role(utilizator.idUser, utilizator.coordbnc, null, null, null, null);
                }
                if (utilizator.codifnsnid != -1)
                {
                    ent.save_user_in_role(utilizator.idUser, utilizator.codifnsnid, null, null, utilizator.codifnsn, null);
                }
                if (utilizator.sefsecid != -1)
                {
                    ent.save_user_in_role(utilizator.idUser, utilizator.sefsecid, null, null, utilizator.sefsec, null);
                }
                if (utilizator.respsu != -1)
                {
                    string[] idclasa = utilizator.idclasasu.Split(',');
                    string[] br = utilizator.idbrsu.Split(',');
                    for (int i = 0; i < idclasa.Length; i++)
                    {
                        ent.save_user_in_role(utilizator.idUser, utilizator.respsu, Convert.ToBoolean(Convert.ToInt32(br[i])), Convert.ToInt32(idclasa[i]), null, null);
                    }

                }

                ///////////////
            }
            
            return Json("Succes");
        }
        public ActionResult Login()
        {

           // ViewBag.ReturnUrl = returnUrl;
            return View();
        }
        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Login", "Account");
        }
        public static string HashPassword(string password)
        {
            System.Security.Cryptography.MD5CryptoServiceProvider x = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] data = System.Text.Encoding.ASCII.GetBytes(password);
            data = x.ComputeHash(data);
            return System.Text.Encoding.ASCII.GetString(data);
        }

        public ActionResult ChangePass()
        {

            return View();
        }
        [HttpPost]
        public ActionResult ChangePass(string old, string nou, string renew)
        {
            using (var ent = new CerereNSNEntities())
            {
                try
                {
                    old = HashPassword(old);
                    ent.verifica_user(User.Identity.Name, old);
                    if (nou != renew)
                    {
                        return Json("Parolele nu coincid!");
                    }
                    else if(renew.Length<8){
                        return Json("Parola trebuie sa contina minimum 8 caractere!");
                    }
                    ent.utilizatori.FirstOrDefault(p => p.nume_utilizator == User.Identity.Name).parola = HashPassword(nou);
                    ent.SaveChanges();
                    return Json("Parola a fost schimbata!");
                }
                catch (Exception ex)
                {
                    return Json(ex.InnerException.Message);

                }
            }
            //return RedirectToAction("Index","Home");
        }
        public  ActionResult autentificare(string user, string parola, bool remember=false)
      {
          using (var ent = new CerereNSNEntities()) 
          {                       
          try
          {
              parola = HashPassword(parola);
                ent.verifica_user(user, parola);
              FormsAuthentication.SetAuthCookie(user, remember);
                if (parola == HashPassword("abcd12!@"))
                {
                    //ViewBag.parola = parola;
                    return Json("schimba parola");
                }
                return Json("succes");                            
                  //throw new Exception("eroare", new Exception("eroare necunoscuta"));             
          }
          catch (Exception ex)
          {
              return Json(ex.InnerException.Message);
          }
          }
          //return null;
      }
        public  void stergeuser(int id)
        {
            try
            {
                var date = ent.utilizatori.FirstOrDefault(p => p.id == id);
                if (date != null)
                {
                    ent.sterge_user(id);
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Eroare la stergere!");
            }
        }
        public void update_user (int id)
        {
            try
            {
                var date = ent.utilizatori.FirstOrDefault(p => p.id == id);
                if (date != null)
                {
                    ent.update_user(id);
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Eroare la activare/dezactivare!");
            }
        }
        public ActionResult Conturi()
        {
            return View(ent.vw_utilizatori);
        }

        public PartialViewResult creare_cont()
        {
            using (CerereNSNEntities ent=new CerereNSNEntities()){
                List <NSNController.DDLItem> listaGrad=new List<NSNController.DDLItem>();
                List<NSNController.DDLItem> listaSu = new List<NSNController.DDLItem>();
                List<NSNController.DDLItem> listaClasa = new List<NSNController.DDLItem>();
                List<NSNController.DDLItem> listaBca=new List<NSNController.DDLItem>();
                for (int i = 0; i < ent.grad.Count(); i++)
                {
                    listaGrad.Add(new NSNController.DDLItem()
                    {
                        Text = ent.grad.ToList()[i].denumire,
                        Value = ent.grad.ToList()[i].id
                    });
                }
                for (int i = 0; i < ent.nomenclator_su.Where(x=>x.tip == true).Count(); i++)
                {
                    listaSu.Add(new NSNController.DDLItem()
                    {
                        Text = ent.nomenclator_su.ToList()[i].denumire,
                        Value = ent.nomenclator_su.ToList()[i].id
                    });
                }
                for (int i = 0; i < ent.grupe_nato.Count(); i++)
                {
                    listaClasa.Add(new NSNController.DDLItem()
                        {
                            Text=ent.grupe_nato.ToList()[i].cod + " - " + ent.grupe_nato.ToList()[i].denumire,
                            Value=ent.grupe_nato.ToList()[i].id
                        });
                }
                for (int i = 0; i < ent.bca.Where(x=>x.id_master==null).Count(); i++)
                {
                    listaBca.Add(new NSNController.DDLItem()
                        {
                            Text = ent.bca.Where(x => x.id_master == null).ToList()[i].denumire,
                            Value = ent.bca.Where(x => x.id_master == null).ToList()[i].id
                        });
                }               
                ViewBag.listaGrad = listaGrad;
                ViewBag.listaSu = listaSu;
                ViewBag.listaClasa = listaClasa;
                ViewBag.listaBca = listaBca;
            }           
            return PartialView();     
        }




        #region CodGenerat
        ///// cod generat ///////////////
        //
        // POST: /Account/Login

        //[HttpPost]
        //[AllowAnonymous]
        //[ValidateAntiForgeryToken]
        //public ActionResult Login(LoginModel model, string returnUrl)
        //{
        //    if (ModelState.IsValid && WebSecurity.Login(model.UserName, model.Password, persistCookie: model.RememberMe))
        //    {
        //        return RedirectToLocal(returnUrl);
        //    }

        //    // If we got this far, something failed, redisplay form
        //    ModelState.AddModelError("", "The user name or password provided is incorrect.");
        //    return View(model);
        //}

        //
        // POST: /Account/LogOff
       
        [HttpPost]
        [ValidateAntiForgeryToken]
        
        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }
        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                // Attempt to register the user
                try
                {
                    WebSecurity.CreateUserAndAccount(model.UserName, model.Password);
                    WebSecurity.Login(model.UserName, model.Password);
                    return RedirectToAction("Index", "Home");
                }
                catch (MembershipCreateUserException e)
                {
                    ModelState.AddModelError("", ErrorCodeToString(e.StatusCode));
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }
        //
        // POST: /Account/Disassociate
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Disassociate(string provider, string providerUserId)
        {
            string ownerAccount = OAuthWebSecurity.GetUserName(provider, providerUserId);
            ManageMessageId? message = null;

            // Only disassociate the account if the currently logged in user is the owner
            if (ownerAccount == User.Identity.Name)
            {
                // Use a transaction to prevent the user from deleting their last login credential
                using (var scope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
                {
                    bool hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
                    if (hasLocalAccount || OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name).Count > 1)
                    {
                        OAuthWebSecurity.DeleteAccount(provider, providerUserId);
                        scope.Complete();
                        message = ManageMessageId.RemoveLoginSuccess;
                    }
                }
            }

            return RedirectToAction("Manage", new { Message = message });
        }
        //
        // GET: /Account/Manage
        public ActionResult Manage(ManageMessageId? message)
        {
            ViewBag.StatusMessage =
                message == ManageMessageId.ChangePasswordSuccess ? "Your password has been changed."
                : message == ManageMessageId.SetPasswordSuccess ? "Your password has been set."
                : message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                : "";
            ViewBag.HasLocalPassword = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            ViewBag.ReturnUrl = Url.Action("Manage");
            return View();
        }
        //
        // POST: /Account/Manage
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Manage(LocalPasswordModel model)
        {
            bool hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            ViewBag.HasLocalPassword = hasLocalAccount;
            ViewBag.ReturnUrl = Url.Action("Manage");
            if (hasLocalAccount)
            {
                if (ModelState.IsValid)
                {
                    // ChangePassword will throw an exception rather than return false in certain failure scenarios.
                    bool changePasswordSucceeded;
                    try
                    {
                        changePasswordSucceeded = WebSecurity.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword);
                    }
                    catch (Exception)
                    {
                        changePasswordSucceeded = false;
                    }

                    if (changePasswordSucceeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.ChangePasswordSuccess });
                    }
                    else
                    {
                        ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
                    }
                }
            }
            else
            {
                // User does not have a local password so remove any validation errors caused by a missing
                // OldPassword field
                ModelState state = ModelState["OldPassword"];
                if (state != null)
                {
                    state.Errors.Clear();
                }

                if (ModelState.IsValid)
                {
                    try
                    {
                        WebSecurity.CreateAccount(User.Identity.Name, model.NewPassword);
                        return RedirectToAction("Manage", new { Message = ManageMessageId.SetPasswordSuccess });
                    }
                    catch (Exception e)
                    {
                        ModelState.AddModelError("", e);
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }
        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            return new ExternalLoginResult(provider, Url.Action("ExternalLoginCallback", new { ReturnUrl = returnUrl }));
        }       
        [AllowAnonymous]
        public ActionResult ExternalLoginCallback(string returnUrl)
        {
            AuthenticationResult result = OAuthWebSecurity.VerifyAuthentication(Url.Action("ExternalLoginCallback", new { ReturnUrl = returnUrl }));
            if (!result.IsSuccessful)
            {
                return RedirectToAction("ExternalLoginFailure");
            }

            if (OAuthWebSecurity.Login(result.Provider, result.ProviderUserId, createPersistentCookie: false))
            {
                return RedirectToLocal(returnUrl);
            }

            if (User.Identity.IsAuthenticated)
            {
                // If the current user is logged in add the new account
                OAuthWebSecurity.CreateOrUpdateAccount(result.Provider, result.ProviderUserId, User.Identity.Name);
                return RedirectToLocal(returnUrl);
            }
            else
            {
                // User is new, ask for their desired membership name
                string loginData = OAuthWebSecurity.SerializeProviderUserId(result.Provider, result.ProviderUserId);
                ViewBag.ProviderDisplayName = OAuthWebSecurity.GetOAuthClientData(result.Provider).DisplayName;
                ViewBag.ReturnUrl = returnUrl;
                return View("ExternalLoginConfirmation", new RegisterExternalLoginModel { UserName = result.UserName, ExternalLoginData = loginData });
            }
        }
        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLoginConfirmation(RegisterExternalLoginModel model, string returnUrl)
        {
            string provider = null;
            string providerUserId = null;

            if (User.Identity.IsAuthenticated || !OAuthWebSecurity.TryDeserializeProviderUserId(model.ExternalLoginData, out provider, out providerUserId))
            {
                return RedirectToAction("Manage");
            }

            if (ModelState.IsValid)
            {
                // Insert a new user into the database
                using (UsersContext db = new UsersContext())
                {
                    UserProfile user = db.UserProfiles.FirstOrDefault(u => u.UserName.ToLower() == model.UserName.ToLower());
                    // Check if user already exists
                    if (user == null)
                    {
                        // Insert name into the profile table
                        db.UserProfiles.Add(new UserProfile { UserName = model.UserName });
                        db.SaveChanges();

                        OAuthWebSecurity.CreateOrUpdateAccount(provider, providerUserId, model.UserName);
                        OAuthWebSecurity.Login(provider, providerUserId, createPersistentCookie: false);

                        return RedirectToLocal(returnUrl);
                    }
                    else
                    {
                        ModelState.AddModelError("UserName", "User name already exists. Please enter a different user name.");
                    }
                }
            }

            ViewBag.ProviderDisplayName = OAuthWebSecurity.GetOAuthClientData(provider).DisplayName;
            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }
        [AllowAnonymous]
        [ChildActionOnly]
        public ActionResult ExternalLoginsList(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return PartialView("_ExternalLoginsListPartial", OAuthWebSecurity.RegisteredClientData);
        }
        [ChildActionOnly]
        public ActionResult RemoveExternalLogins()
        {
            ICollection<OAuthAccount> accounts = OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name);
            List<ExternalLogin> externalLogins = new List<ExternalLogin>();
            foreach (OAuthAccount account in accounts)
            {
                AuthenticationClientData clientData = OAuthWebSecurity.GetOAuthClientData(account.Provider);

                externalLogins.Add(new ExternalLogin
                {
                    Provider = account.Provider,
                    ProviderDisplayName = clientData.DisplayName,
                    ProviderUserId = account.ProviderUserId,
                });
            }

            ViewBag.ShowRemoveButton = externalLogins.Count > 1 || OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            return PartialView("_RemoveExternalLoginsPartial", externalLogins);
        }
        #region Helpers
        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        public enum ManageMessageId
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
        }

        internal class ExternalLoginResult : ActionResult
        {
            public ExternalLoginResult(string provider, string returnUrl)
            {
                Provider = provider;
                ReturnUrl = returnUrl;
            }

            public string Provider { get; private set; }
            public string ReturnUrl { get; private set; }

            public override void ExecuteResult(ControllerContext context)
            {
                OAuthWebSecurity.RequestAuthentication(Provider, ReturnUrl);
            }
        }

        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "User name already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A user name for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }
        #endregion
        #endregion
    }
}
