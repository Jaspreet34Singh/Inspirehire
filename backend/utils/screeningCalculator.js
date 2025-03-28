/**
 * Screening Calculator Utility
 * Provides methods to calculate screening scores for job applications
 */
class ScreeningCalculator {
    static calculateScreening(screeningData) {
        const MinFieldRelatedExp = screeningData.MinFieldRelatedExp;
        const ApplicantFieldRelatedExp = screeningData.ApplicantFieldRelatedExp;
        const ApplicantOffFieldExpTier = screeningData.ApplicantOffFieldExpTier;
        const MinEducationLevel = screeningData.MinEducationLevel;
        const ApplicantEducationLevel = screeningData.ApplicantEducationLevel;
        
        // Use let instead of const for flags that will be modified
        let EduFlag = false;
        let WorkFlag = false;

        // console.log(this.calculateEducationScore(ApplicantEducationLevel)+ ">=" + this.calculateEducationScore(MinEducationLevel))
        // Calculate education score comparison
        if (this.calculateEducationScore(ApplicantEducationLevel) >= this.calculateEducationScore(MinEducationLevel)) {
            EduFlag = true;
        }
        
        // Calculate work experience comparison
        const totalWorkExp = this.calculateFieldExperienceScore(ApplicantFieldRelatedExp) + ApplicantOffFieldExpTier;


        // console.log(totalWorkExp + "total work exp")
        // console.log(this.calculateFieldExperienceScore(MinFieldRelatedExp)+ "min work exp")

        if (Number(totalWorkExp) >= Number(this.calculateFieldExperienceScore(MinFieldRelatedExp))) {
            WorkFlag = true;
        }

        return {
            ScreeningDetails: (EduFlag && WorkFlag) ? "Next Step" : "Screened Out"
        };
    }

    static calculateEducationScore(educationLevel) {
        const educationScores = {
            'Masters': 200,
            'Bachelors': 100,
            'Diploma': 75,
            'Certificate': 50
        };
        
        return educationScores[educationLevel] || 0;
    }

    static calculateFieldExperienceScore(years) {
        return years * 100;
    }
}

export default ScreeningCalculator;