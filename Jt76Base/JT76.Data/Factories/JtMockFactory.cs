using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Faker;
using Jt76Base.Data.Models;

namespace Jt76Base.Data.Factories
{
    //http://10consulting.com/2011/11/18/populating-test-data-using-c-sharp/

    //__Contact info__

    //var name = Faker.Name.FullName();  // "Alene Hayes"
    //Faker.Internet.Email(name);  // "alene_hayes@hartmann.co.uk"
    //Faker.Internet.UserName(name);  // "alene.hayes"

    //Faker.Internet.Email();  // "morris@friesen.us"
    //Faker.Internet.FreeEmail();  // "houston_purdy@yahoo.com"

    //Faker.Internet.DomainName();  // "larkinhirthe.com"

    //Faker.Phone.Number();  // "(033)216-0058 x0344"


    //__Addresses__

    //Faker.Address.StreetAddress();  // "52613 Turcotte Lock"
    //Faker.Address.SecondaryAddress();  // "Suite 656"
    //Faker.Address.City();  // "South Wavaside"

    //Faker.Address.UkCounty();  // "West Glamorgan"
    //Faker.Address.UkPostCode().ToUpper();  // "BQ7 3AM"

    //Faker.Address.UsState();  // "Tennessee"
    //Faker.Address.ZipCode();  // "66363-7828"


    //__Lorem Ipsum sentences and paragraphs__

    //Faker.Lorem.Sentence();  // "Voluptatem repudiandae necessitatibus assumenda dolor illo maiores in."
    //Faker.Lorem.Paragraph();  /* "Rerum dolor cumque cum animi consequatur praesentium. Enim quia quia modi est ut. Dolores qui debitis qui perspiciatis autem quas. Expedita distinctio earum aut. Delectus assumenda rerum quibusdam harum iusto." */


    //__company names, catchphrases and bs__

    //Faker.Company.Name();  // "Dickens Group"
    //Faker.Company.CatchPhrase();  // "User-centric neutral internet solution"
    //Faker.Company.BS();  // "transition proactive solutions"

    public static class JtMockFactory
    {

        public static IQueryable<Error> GetErrorMocks(int nCount)
        {
            var list = new List<Error>();

            for (var i = 0; i < nCount; i++)
            {
                try
                {
                    ErrorFactory.GetThrownException();
                }
                catch (Exception e)
                {
                    list.Add(ErrorFactory.GetErrorFromException(e, ErrorLevels.Critical, Company.CatchPhrase()));
                }
            }

            var count = 1;
            foreach (var item in list)
            {
                item.Id = count++;
                item.DtCreated = DateTime.UtcNow;
            }

            return list.AsQueryable();
        }


        public static IQueryable<LogMessage> GetLogMessageMocks(int nCount)
        {
            var list = new List<LogMessage>();

            for (var i = 0; i < nCount; i++)
            {
                list.Add(new LogMessage() { StrLogMessage = GetFakerParagraphs(nCount % 3 + 1) });
            }

            var count = 1;
            foreach (var item in list)
            {
                item.Id = count++;
                item.DtCreated = DateTime.UtcNow;
            }

            return list.AsQueryable();
        }


        public static string GetFakerParagraphs(int nParagraphCount)
        {
            //return Faker.Lorem.Paragraphs(nParagraphCount).Aggregate("", (current, item) => current + (item + Environment.NewLine));

            var sb = new StringBuilder();
            foreach (string item in Lorem.Paragraphs(nParagraphCount))
            {
                sb.AppendLine(item);
            }

            return sb.ToString();
        }

    }
}