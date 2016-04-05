using System;
using System.Linq;
using System.Collections.Generic;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;
using System.Web.Http;
using Umbraco.Core.Models;
using Umbraco.Web.PublishedContentModels;
/// <summary>
/// Summary description: API BACKEND usato nella custom section per gestire le iscrizioni eventi
/// </summary>

[PluginController("xeCustom")]
public class xeCustomApiBackofficeController : UmbracoAuthorizedJsonController
{

    //GET /umbraco/backoffice/xeCustom/xeCustomApiBackoffice/GetEventSubscriptions/<IDEVENTO>
    [HttpGet]
    public IHttpActionResult GetEventSubscriptions(string id) {
        int eventId;
        if (!int.TryParse(id, out eventId)) {
            return BadRequest(); //STATUSCODE = 400
        } else {
            var db = Umbraco.UmbracoContext.Application.DatabaseContext.Database;
            return Ok<IEnumerable<SubscriptionPoco>>(db.Fetch<SubscriptionPoco>(BuildSQL("WHERE [EventId] = @eventId"), new { eventId = eventId }));
        }
    }


    //POST /umbraco/backoffice/xeCustom/xeCustomApiBackoffice/NewSubscription   con body = {"EventId":1140, "Name":"Mr", "Surname":"X", "Email":"mr@x.com", "Privacy":true, "City":"Y"}
    [HttpPost]
    public IHttpActionResult NewSubscription(RegistrationModel model) {
        if (!ModelState.IsValid) {
            return BadRequest(); //STATUSCODE = 400
        } else {
            var db = Umbraco.UmbracoContext.Application.DatabaseContext.Database;
            var mbr = Umbraco.UmbracoContext.Application.Services.MemberService;

            SubscriptionPoco oldSubscription = db.SingleOrDefault<SubscriptionPoco>(BuildSQL("WHERE [EventId] = @eventId AND [Email] = @email"), new { eventId = model.EventId, email = model.Email });
            if (oldSubscription != null) {
                return Conflict(); //STATUSCODE = 409
            } else {
                SubscriptionPoco subscriptionData = new SubscriptionPoco();
                subscriptionData.EventId = model.EventId;
                subscriptionData.Name = model.Name;
                subscriptionData.Surname = model.Surname;
                subscriptionData.Email = model.Email;
                subscriptionData.City = model.City;
                subscriptionData.IsConfirmed = false;
                subscriptionData.ConfirmationKey = Guid.NewGuid();
                subscriptionData.SubscriptionDate = DateTime.Now;
                subscriptionData.ConfirmationDate = null;
                subscriptionData.IsPresent = false;
                IMember socio = mbr.GetByEmail(model.Email);
                if (socio == null) {
                    subscriptionData.MemberId = null;
                } else {
                    subscriptionData.MemberId = socio.Id;
                }

                //Inserisco l'iscrizione nel database
                var insertResult = db.Insert(subscriptionData);
                return Ok<SubscriptionPoco>(subscriptionData);
            }
        }
    }


    //DELETE /umbraco/backoffice/xeCustom/xeCustomApiBackoffice/DelSubscription/<IDSUBSCRIPTION>  
    [AcceptVerbs("DELETE")]
    public IHttpActionResult DelSubscription(string id) {
        int subscriptionId;
        if (!int.TryParse(id, out subscriptionId)) {
            return BadRequest(); //STATUSCODE = 400
        } else {
            var db = Umbraco.UmbracoContext.Application.DatabaseContext.Database;
            var subscriptionData = db.SingleOrDefault<SubscriptionPoco>(BuildSQL("WHERE [Id] = @id"), new { id = subscriptionId });
            if (subscriptionData == null) {
                return NotFound(); //STATUSCODE = 404
            } else {
                int nDelete = db.Delete<SubscriptionPoco>(subscriptionData);
                if (nDelete != 1) {
                    return Conflict(); //STATUSCODE = 409
                } else {
                    return Ok();
                }
            }
        }
    }

    //PUT /umbraco/backoffice/xeCustom/xeCustomApiBackoffice/TogglePresent/<IDSUBSCRIPTION>
    [HttpPut]
    public IHttpActionResult TogglePresent(string id) {
        int subscriptionId;
        if (!int.TryParse(id, out subscriptionId)) {
            return BadRequest(); //STATUSCODE = 400
        } else {
            var db = Umbraco.UmbracoContext.Application.DatabaseContext.Database;
            var subscriptionData = db.SingleOrDefault<SubscriptionPoco>(BuildSQL("WHERE [Id] = @id"), new { id = subscriptionId });
            if (subscriptionData == null) {
                return NotFound(); //STATUSCODE = 404
            } else {
                subscriptionData.IsPresent = !subscriptionData.IsPresent;
                int nUpdate = db.Update(subscriptionData, new string[] { "IsPresent" });
                if (nUpdate != 1) {
                    return Conflict(); //STATUSCODE = 409
                } else {
                    return Ok<SubscriptionPoco>(subscriptionData);
                }
            }
        }
    }

    //POST /umbraco/backoffice/xeCustom/xeCustomApiBackoffice/SendConfirmationEmail/<IDSUBSCRIPTION>
    [HttpPost]
    public IHttpActionResult SendConfirmationEmail(string id) {
        int subscriptionId = -1; int.TryParse(id, out subscriptionId);
        var db = Umbraco.UmbracoContext.Application.DatabaseContext.Database;
        var subscriptionData = db.SingleOrDefault<SubscriptionPoco>(BuildSQL("WHERE [Id] = @id"), new { id = subscriptionId });
        if (subscriptionData == null) {
            return NotFound(); //STATUSCODE = 404
        } else {
            if (!FAKESENDMAIL(subscriptionData.Email, subscriptionData.ConfirmationKey.ToString())) {
                return InternalServerError(); //STATUSCODE = 500
            } else {
                return Ok();
            }
        }
    }


    //POST /umbraco/backoffice/xeCustom/xeCustomApiBackoffice/SendBarcodeEmail/<IDSUBSCRIPTION>
    [HttpPost]
    public IHttpActionResult SendBarcodeEmail(string id) {
        int subscriptionId = -1; int.TryParse(id, out subscriptionId);
        var db = Umbraco.UmbracoContext.Application.DatabaseContext.Database;
        var subscriptionData = db.SingleOrDefault<SubscriptionPoco>(BuildSQL("WHERE [Id] = @id"), new { id = subscriptionId });
        if (subscriptionData == null) {
            return NotFound(); //STATUSCODE = 404
        } else {
            if (!FAKESENDMAIL(subscriptionData.Email, subscriptionData.Id.ToString("{0:000000}"))) {
                return InternalServerError(); //STATUSCODE = 500
            } else {
                return Ok();
            }
        }
    }


    private string BuildSQL(string where) { //Query per leggere dati da tabella custom XE_EventSubscription --> tipo dati SubscriptionPoco
        return "SELECT [Id],[EventId],[Name],[Surname],[Email],[City],[ConfirmationKey],[IsConfirmed],[SubscriptionDate],[ConfirmationDate],[IsPresent],[MemberId] FROM [Xe_EventSubscription] " + where;
    }

    private bool FAKESENDMAIL(string email, string body) {
        //SIMULA INVIO EMAIL CHE FALLISCE 10% VOLTE
        Console.WriteLine(string.Format("FAKEMAIL {0} - {1}", email, body));
        return new Random().NextDouble() > 0.1;
    }

}
