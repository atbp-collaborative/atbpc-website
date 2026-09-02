'use client';

import React from 'react';
import { ProposalFormData } from '@/lib/forms/proposal';
import { TextField } from '@/components/forms/form-fields/TextField';
import { SelectField } from '@/components/forms/form-fields/SelectField';
import { Button } from '@/components/primitives/Button';
import { Plus, Trash2, Info } from 'lucide-react';

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step1Contact: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  const renderPersonList = (field: 'principalDecisionMakers' | 'authorizedRepresentatives', label: string, max: number = 2) => {
    const list = formData[field] || [{}];

    const handleUpdate = (index: number, key: string, value: string) => {
      const newList = [...list];
      newList[index] = { ...newList[index], [key]: value };
      updateField(field, newList);
    };

    const handleAdd = () => {
      if (list.length < max) {
        updateField(field, [...list, {}]);
      }
    };

    const handleRemove = (index: number) => {
      const newList = list.filter((_, i) => i !== index);
      updateField(field, newList.length > 0 ? newList : [{}]);
    };

    return (
      <div className="mb-10">
        <h3 className="font-sans text-h3 font-bold mb-4 flex justify-between items-center">
          {label}
        </h3>
        {field === 'authorizedRepresentatives' && (
          <div className={`mb-6 p-4 rounded-lg flex gap-3 ${isDarkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-800'}`}>
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-caption">Reminder: You will be required to submit an SPA (Special Power of Attorney) on the next step. Please prepare your PDF file.</p>
          </div>
        )}
        
        {list.map((person, i) => (
          <div key={i} className="mb-8 relative">
            {i > 0 && (
              <button 
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700 transition-colors"
                title="Remove person"
              >
                <Trash2 size={18} />
              </button>
            )}
            <h4 className="font-sans font-medium text-mini mb-4 opacity-70 uppercase tracking-widest">Person {i + 1}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField 
                name="firstName" label="Given Name" 
                value={person.firstName || ''} onChange={(_, val) => handleUpdate(i, 'firstName', val)} 
                isDarkMode={isDarkMode} 
              />
              <TextField 
                name="middleName" label="Middle Name" 
                value={person.middleName || ''} onChange={(_, val) => handleUpdate(i, 'middleName', val)} 
                isDarkMode={isDarkMode} 
              />
              <TextField 
                name="lastName" label="Last Name" 
                value={person.lastName || ''} onChange={(_, val) => handleUpdate(i, 'lastName', val)} 
                isDarkMode={isDarkMode} 
              />
              <TextField 
                name="title" label="Title / Suffix / Prefix" 
                value={person.title || ''} onChange={(_, val) => handleUpdate(i, 'title', val)} 
                isDarkMode={isDarkMode} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField 
                type="tel" name="contactNo" label="Contact No." 
                value={person.contactNo || ''} onChange={(_, val) => handleUpdate(i, 'contactNo', val)} 
                isDarkMode={isDarkMode} 
              />
              <TextField 
                type="email" name="email" label="Email Address" 
                value={person.email || ''} onChange={(_, val) => handleUpdate(i, 'email', val)} 
                isDarkMode={isDarkMode} 
              />
              <div className="md:col-span-2">
                <TextField 
                  name="address" label="Current Address" 
                  value={person.address || ''} onChange={(_, val) => handleUpdate(i, 'address', val)} 
                  isDarkMode={isDarkMode} 
                />
              </div>
            </div>
          </div>
        ))}
        
        {list.length < max && (
          <button
            type="button"
            onClick={handleAdd}
            className={`mt-2 py-2 px-6 rounded-xl border text-caption font-medium transition-all hover:opacity-80 flex items-center space-x-2 ${isDarkMode ? 'border-bright-gray/30 bg-vintage-charcoal/50 text-white' : 'border-vintage-charcoal/30 bg-white/60 text-vintage-charcoal'}`}
          >
            <Plus size={16} />
            <span>Add another {label.split('. ')[1].toLowerCase()}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <span className="text-caption font-sans text-space-sparkle block opacity-70 mb-2 uppercase tracking-widest">Step 1 of 4</span>
        <h2 className="font-sans text-h2 font-bold text-space-sparkle mb-2">Contact Information</h2>
        <p className="text-caption opacity-60">Please provide the details for the principal decision makers and authorized representatives.</p>
      </div>

      <div className="mb-10 w-full md:w-1/2">
        <SelectField
          name="businessEntity"
          label="Will the project be named after a business or a private entity?"
          placeholder="Select Yes or No"
          options={[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' }
          ]}
          value={formData.businessEntity || ''}
          onChange={(name, val) => updateField('businessEntity', val)}
          isDarkMode={isDarkMode}
        />
      </div>

      {renderPersonList('principalDecisionMakers', 'a. Principal Decision Maker', 3)}
      {renderPersonList('authorizedRepresentatives', 'b. Authorized Representative', 1)}
    </div>
  );
};

