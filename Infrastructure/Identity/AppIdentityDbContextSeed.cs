using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Madhu Keshav",
                    Email = "mk@test.com",
                    UserName = "mk@test.com",
                    Address = new Address
                    {
                        FirstName = "Madhu",
                        LastName = "Keshav",
                        Street = "6th Street",
                        City = "Bengaluru",
                        State = "Karnataka",
                        ZipCode = "560001"
                    }

                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}
