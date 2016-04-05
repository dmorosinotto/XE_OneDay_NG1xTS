using System;
using Umbraco.Core.Persistence;
using Umbraco.Core.Persistence.DatabaseAnnotations;
using System.ComponentModel.DataAnnotations;

/// <summary>
/// Classe Poco usata in PetaPoco (ORM) per accedere al database/tabella custom delle iscrizioni
/// </summary>
[TableName("Xe_EventSubscription")]
[PrimaryKey("Id", autoIncrement = true)]
[ExplicitColumns]
public class SubscriptionPoco
{
    [Column("id")]
    [PrimaryKeyColumn(AutoIncrement = true)]
    public int Id { get; set; }

    [Column("EventId")]
    public int EventId { get; set; }

    [Column("Name")]
    public string Name { get; set; }

    [Column("Surname")]
    public string Surname { get; set; }

    [Column("Email")]
    public string Email { get; set; }

    [Column("City")]
    public string City { get; set; }

    [Column("ConfirmationKey")]
    public Guid ConfirmationKey { get; set; }

    [Column("IsConfirmed")]
    public bool IsConfirmed { get; set; }

    [Column("SubscriptionDate")]
    public DateTime SubscriptionDate { get; set; }

    [Column("ConfirmationDate")]
    public DateTime? ConfirmationDate { get; set; }

    [Column("IsPresent")]
    public bool IsPresent { get; set; }

    [Column("MemberId")]
    public int? MemberId { get; set; }

}


/// <summary>
/// Model del body della richiesta di nuova registrazione, viene usata per leggere/validare il JSON della Post di registrazione
/// </summary>
public class RegistrationModel
{
    [Required]
    public int EventId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; }

    [Required]
    [MaxLength(50)]
    public string Surname { get; set; }

    [Required]
    [MaxLength(100)]
    [EmailAddress(ErrorMessage = "Invalid Email Address")]
    public string Email { get; set; }

    [MaxLength(100)]
    public string City { get; set; }

    [Required]
    [Range(typeof(bool), "true", "true", ErrorMessage = "Subscribe Privacy")]
    public bool Privacy { get; set; }

    public RegistrationModel() {
    }
}
