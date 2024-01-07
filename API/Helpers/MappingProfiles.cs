using API.DTOs;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(destinationMember => destinationMember.ProductBrand,
                options => options.MapFrom(sourceMember => sourceMember.ProductBrand.Name))
                .ForMember(destinationMember => destinationMember.ProductType,
                options => options.MapFrom(sourceMember => sourceMember.ProductType.Name))
                .ForMember(destinationMember => destinationMember.PictureUrl,
                options => options.MapFrom<ProductUrlResolver>());
        }
    }
}
