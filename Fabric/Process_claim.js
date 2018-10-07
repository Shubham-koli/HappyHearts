async function claimTransaction(ClaimRequest) {
  let claimDetails = ClaimRequest.contract;
  let customer = {};
  customer.HospitalFees = ClaimRequest.HospitalFees;
  customer.PharmacyFees = ClaimRequest.PharmacyFees;
  customer.AcFees = ClaimRequest.AcFees;
  customer.ConsultancyFees = ClaimRequest.ConsultancyFees;
  let insurer = ClaimRequest.insurer;

  if (
    isNaN(parseFloat(customer.HospitalFees)) ||
    isNaN(parseFloat(customer.PharmacyFees)) ||
    isNaN(parseFloat(customer.ConsultancyFees)) ||
    isNaN(parseFloat(customer.AcFees)) ||
    isNaN(parseFloat(insurer.HospitalFees)) ||
    isNaN(parseFloat(insurer.PharmacyFees)) ||
    isNaN(parseFloat(insurer.ConsultancyFees)) ||
    isNaN(parseFloat(insurer.AcFees))
  ) {
    console.log("It's not valid");
    return new Error("invalid data in transaction");
  } else {
    if (
      insurer.HospitalFees == "0" &&
      insurer.PharmacyFees == "0" &&
      insurer.ConsultancyFees == "0" &&
      insurer.AcFees == "0"
    ) {
      return new Error("Insurer can not process your claim");
    } else {
      if (
        parseFloat(customer.HospitalFees) > parseFloat(insurer.HospitalFees)
      ) {
        console.log("hospital claim policy exceeded!");
        var x =
          parseFloat(customer.HospitalFees) - parseFloat(insurer.HospitalFees);
        console.log("Patient has to pay:" + x);
        claimDetails.claimed_HospitalFees = parseFloat(
          insurer.HospitalFees
        ).toString();
        insurer.HospitalFees = "0";
        claimDetails.remaining_HospitalFees = parseFloat(x).toString();
      } else {
        let x = (
          parseFloat(insurer.HospitalFees) - parseFloat(customer.HospitalFees)
        ).toString();
        insurer.HospitalFees = parseFloat(x).toString();
        claimDetails.claimed_HospitalFees = parseFloat(
          customer.HospitalFees
        ).toString();
        claimDetails.remaining_HospitalFees = "0";
      }

      if (
        parseFloat(customer.PharmacyFees) > parseFloat(insurer.PharmacyFees)
      ) {
        console.log("pharmacy claim policy exceeded!");
        var x =
          parseFloat(customer.PharmacyFees) - parseFloat(insurer.PharmacyFees);
        console.log("Pharmacy has to pay:" + x);
        claimDetails.claimed_PharmacyFees = parseFloat(
          insurer.PharmacyFees
        ).toString();
        insurer.PharmacyFees = "0";
        claimDetails.remaining_PharmacyFees = parseFloat(x).toString();
      } else {
        let x = (
          parseFloat(insurer.PharmacyFees) - parseFloat(customer.PharmacyFees)
        ).toString();
        insurer.PharmacyFees = parseFloat(x).toString();
        claimDetails.claimed_PharmacyFees = parseFloat(
          customer.PharmacyFees
        ).toString();
        claimDetails.remaining_PharmacyFees = "0";
      }

      if (
        parseFloat(customer.ConsultancyFees) >
        parseFloat(insurer.ConsultancyFees)
      ) {
        console.log("consultancy claim policy exceeded!");
        var x =
          parseFloat(customer.ConsultancyFees) -
          parseFloat(insurer.ConsultancyFees);
        console.log("consultancy has to pay:" + x);
        claimDetails.claimed_ConsultancyFees = parseFloat(
          insurer.ConsultancyFees
        ).toString();
        insurer.ConsultancyFees = "0";
        claimDetails.remaining_ConsultancyFees = parseFloat(x).toString();
      } else {
        let x = (
          parseFloat(insurer.ConsultancyFees) -
          parseFloat(customer.ConsultancyFees)
        ).toString();
        insurer.ConsultancyFees = parseFloat(x).toString();
        claimDetails.claimed_ConsultancyFees = parseFloat(
          customer.ConsultancyFees
        ).toString();
        claimDetails.remaining_ConsultancyFees = "0";
      }

      if (parseFloat(customer.AcFees) > parseFloat(insurer.AcFees)) {
        console.log("ac claim policy exceeded!");
        var x = parseFloat(customer.AcFees) - parseFloat(insurer.AcFees);
        console.log("ac has to pay:" + x);
        claimDetails.claimed_AcFees = parseFloat(insurer.AcFees).toString();
        insurer.AcFees = "0";
        claimDetails.remaining_AcFees = parseFloat(x).toString();
      } else {
        let x = (
          parseFloat(insurer.AcFees) - parseFloat(customer.AcFees)
        ).toString();
        insurer.AcFees = parseFloat(x).toString();
        claimDetails.claimed_AcFees = parseFloat(customer.AcFees).toString();
        claimDetails.remaining_AcFees = "0";
      }

      //Update on Blockchain
      let assetRegistry = await getAssetRegistry(
        "org.example.basic.claimDetails"
      );
      await assetRegistry.update(claimDetails); //claimDetails.from

      let participantRegistry = await getParticipantRegistry(
        "org.example.basic.InsurerPolicy"
      );
      await participantRegistry.update(insurer);
      console.log("Trying to UPDATE patient");
    }
  }
}
